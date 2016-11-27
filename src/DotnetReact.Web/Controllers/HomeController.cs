using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotnetreactWeb.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ClaimsPrincipal cp = ClaimsPrincipal.Current;
            string welcome = string.Format("Welcome, {0} {1}!", cp.FindFirst(ClaimTypes.GivenName).Value, cp.FindFirst(ClaimTypes.Surname).Value);
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
