using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Lektion_9_Resilience;

public class UserHealthCheck : IHealthCheck 
{

    private volatile bool _isReady = false;
    public bool IsReady { 
        get => _isReady;
        set => _isReady = value; 
    }

    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default) 
    {
        return Task.FromResult(_isReady ? HealthCheckResult.Healthy() : HealthCheckResult.Unhealthy());
    }
}