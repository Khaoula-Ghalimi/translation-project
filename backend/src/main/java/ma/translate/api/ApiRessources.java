package ma.translate.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ma.translate.services.GeminiService;

@Path("isup")
public class ApiRessources {
	
	@GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response isApiUp() {
        GeminiService service = new GeminiService();

        if (service.isApiUp()) {
            return Response
                    .status(Response.Status.OK)
                    .entity("{\"status\": \"UP\"}")
                    .build();
        } else {
            return Response
                    .status(Response.Status.SERVICE_UNAVAILABLE)
                    .entity("{\"status\": \"DOWN\"}")
                    .build();
        }
    }
	

}
