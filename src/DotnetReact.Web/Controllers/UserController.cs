using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotnetreactWeb.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {

        [HttpGet]
        public UserModel Get()
        {
            return new UserModel()
            {
                FirstName = "John"
            };
        }

        public class UserModel
        {
            public string FirstName { get; set; }
        }
    }
}
