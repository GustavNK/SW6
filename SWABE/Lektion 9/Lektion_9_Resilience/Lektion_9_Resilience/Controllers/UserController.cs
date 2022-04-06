using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Lektion_9_Resilience.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly UserHealthCheck _check;
    
    public UserController(IHttpClientFactory httpClientFactory, UserHealthCheck check)
    {
        _httpClientFactory = httpClientFactory;
        _check = check;
    }

    [HttpGet]
    public async Task<ActionResult> OnGetAsync() {
        var result = await _httpClientFactory.CreateClient("PollyWaitAndRetry").GetAsync("");
        return new StatusCodeResult((int)result.StatusCode);
    }
    
    [Route("/hc-users")]
    [HttpGet]
    public Task<IsReadyResponse> GetAsync() {
        _check.IsReady = !_check.IsReady;
        return Task.FromResult(new IsReadyResponse {
            IsReady = _check.IsReady
        });
    }
    
    public sealed class IsReadyResponse {
        public bool IsReady { get; set; }
    }
    
    
}