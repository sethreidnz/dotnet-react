using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetreactWeb.Configuration
{
    public class AzureAdOptions
    {
        public string ClientId { get; set; }
        public string AadInstance { get; set; }
        public string Tenant { get; set; }
        public string Authority { get; set; }
        public string PostLogoutRedirectUri { get; set; }
    }
}
