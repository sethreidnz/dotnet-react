using Microsoft.AspNetCore.Mvc;

namespace DotnetreactWeb.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {

        [HttpGet]
        public UserModel Get()
        {           
            if(User == null) return  null;
                return new UserModel(){
                    FirstName = "Seth"
            };
        }

        public class UserModel
        {
            public string FirstName { get; set; }
        }
    }
}
