using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.AspNetCore.Authentication.Cookies;
using DotnetreactWeb.Configuration;

namespace DotnetreactWeb
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets();
            }
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add Options Objects see https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration
            services.Configure<AzureAdOptions>(options => Configuration.GetSection("AzureAd").Bind(options));

            // Add framework services.
            services.AddMvc();

            if(getAzureAdOptions() != null)
            {
                // Add Authentication services.
                services.AddAuthentication(sharedOptions => sharedOptions.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme);
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            ConfigureAuthentication(app);
            
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }

        private void ConfigureAuthentication(IApplicationBuilder app)
        {
            var azureAdOptions = getAzureAdOptions();
            if (azureAdOptions != null)
            {
                Console.Write("Configuring Authentication");
                // Configure the OWIN pipeline to use cookie auth.
                app.UseCookieAuthentication(new CookieAuthenticationOptions());

                // Configure the OWIN pipeline to use OpenID Connect auth.
                app.UseOpenIdConnectAuthentication(new OpenIdConnectOptions
                {
                    ClientId = azureAdOptions.ClientId,
                    Authority = $"{azureAdOptions.AadInstance}/{azureAdOptions.Tenant}",
                    ResponseType = OpenIdConnectResponseType.IdToken,
                    PostLogoutRedirectUri = azureAdOptions.PostLogoutRedirectUri.ToString(),
                    Events = new OpenIdConnectEvents
                    {
                        OnRemoteFailure = OnAuthenticationFailed,
                    }
                });
            }
            else
            {
                Console.Write("Authentication appsettings not set. Skipping configuration.");
            }
        }

        private AzureAdOptions getAzureAdOptions()
        {
            if (string.IsNullOrEmpty(Configuration["AzureAD:ClientId"]) ||
                string.IsNullOrEmpty(Configuration["AzureAD:AadInstance"]) ||
                string.IsNullOrEmpty(Configuration["AzureAD:Tenant"]) ||
                string.IsNullOrEmpty(Configuration["AzureAd:PostLogoutRedirectUri"])
                )
            {
                return null;
            }
            return new AzureAdOptions()
            {
                ClientId = Configuration["AzureAD:ClientId"],
                AadInstance = Configuration["AzureAD:AadInstance"],
                Tenant = Configuration["AzureAD:Tenant"],
                PostLogoutRedirectUri = Configuration["AzureAD:PostLogoutRedirectUri"]
            };
        }

        // Handle sign-in errors differently than generic errors.
        private Task OnAuthenticationFailed(FailureContext context)
        {
            context.HandleResponse();
            context.Response.Redirect("/Home/Error?message=" + context.Failure.Message);
            return Task.FromResult(0);
        }
    }
}
