using System.Web.Mvc;

namespace ping_pong.Controllers 
{
    public class GameController : Controller
    {
        public ActionResult Index(bool val)
        {
            ViewBag.SinglePlayer = val;
            return View();
        }
    }
}