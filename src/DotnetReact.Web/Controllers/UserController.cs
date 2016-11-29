using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotnetreactWeb.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {

        [HttpGet]
        public UserModel Get()
        {
            var identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> claims = identity.Claims;
            var email = identity.FindFirst((Claim claim) => {
                return claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
            })?.Value;
            return new UserModel()
            {
                FirstName = email
            };
        }

        public class UserModel
        {
            public string FirstName { get; set; }
        }
    }
}
