# Dotnet React

This project was created using the [ASPET JavaScript Services](https://github.com/aspnet/JavaScriptServices) React-Redux Yoeman Generator.

This starter kit includes includes:

 * [**.NET Core MVC**]() for serving the client app and creating API end points.
 * [**React**](https://facebook.github.io/react/)
 * [**Redux**](http://redux.js.org/) for handling client side application state
 * [**Bootstrap 4**](https://v4-alpha.getbootstrap.com/) as a css framework
 * [**Server-side prerendering**](#server-side-prerendering) for *universal* (a.k.a. *isomorphic*) applications, where your Angular 2 / React / etc. components are first rendered on the server, and then transferred to the client where execution continues
 * [**Webpack middleware**](#webpack-dev-middleware) so that, during development, any webpack-built resources will be generated on demand, without you having to run webpack manually or compile files to disk
 * [**Hot module replacement**](#webpack-hot-module-replacement) so that, during development, your code and markup changes will be pushed to your browser and updated in the running application automatically, without even needing to reload the page
 * [**Routing helpers**](#routing-helper-mapspafallbackroute) for integrating server-side routing with client-side routing
 * [**Azure Active Diretory Open ID Connect integration**](https://azure.microsoft.com/en-us/resources/samples/active-directory-dotnet-webapp-openidconnect-aspnetcore/) for securing the entire web application, or just parts of it. 

 
## Table Of Contents
1. [Prerequisites](#Prerequisites)
1. [Quick Start](#Quick-Start)
1. [Project Structure](#Project-Structure)

## Quick Start

* **Node 4+** I recommend [NVM](https://github.com/creationix/nvm) or [NVM for Windows]()
* [**.NET Core 1.0.1 SDK**](https://www.microsoft.com/net/download/core)

There are two primary ways to work with this project:

 * Use [**Visual Studio Code**](https://code.visualstudio.com) with the [**.NET Core CLI preview 2**](https://docs.microsoft.com/en-us/dotnet/articles/core/tools/)
 * Use [**Visual Studio 2015**](https://www.visualstudio.com/vs)

## Quick Start

Clone the repository:

```bash
git clone https://github.com/justsayno/dotnet-react {YourProjectName}
cd {YourProjectName}
```

Restore the packages:

```bash
dotnet restore
```

Run the application with hot module reloading and automatic re-compiling of .NET code:

```bash
cd src/DotnetReact.Web
dotnet watch run
```

## Project Structure

TBC

## Setting up Azure AD Integration

> NOTE: For more detail on how the Azure AD integration done see [here](https://azure.microsoft.com/en-us/resources/samples/active-directory-dotnet-webapp-openidconnect-aspnetcore/)

To set up Azure AD you need to first create and application in Azure AD and then set the configuration values for:

- ClientId - The Application ID in the Azure Portal
- Tenant - The name of your Azure AD Instance
- AadInstance - The public instance of Azure AD (if using default Azure AD then it will be https://login.microsoftonline.com)
- PostLogoutRedirectUri - **Optional:** The URL to redirect to after logout

You can update the configuration for your local environment in two ways:

**User Secrets (*Recommened*)**

> Note: For more information on user secrets in Aspnet Core see [here](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets)

To update your user secrets just run the following commands replacing with your Azure AD Application details:

```bash
cd src/DotnetReact.Web
dotnet user-secrets list
# info: No secrets configured for this application.
dotnet user-secrets set AzureAd:ClientId {Your Azure ClientId} # Required
dotnet user-secrets set AzureAd:Tenant {Your Tenant} # Required
dotnet user-secrets set AzureAd:AadInstance {Your AadInstance} # Required
dotnet user-secrets set AzureAd:PostLogoutRedirectUri {Your PostLogoutRedirectUri} # Optional
```

**appsettings.json**

> NOTE: If you use this method then the settings will be checked into source control

Update the values in the appsettings.json:

```json
"AzureAd": {
    "ClientId": "", // Required
    "Tenant": "", // Required
    "AadInstance": "", // Required
    "PostLogoutRedirectUri": "" // Optional
}
```

## Using and IDE

TBC