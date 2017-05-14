using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ping_pong.Startup))]
namespace ping_pong
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
