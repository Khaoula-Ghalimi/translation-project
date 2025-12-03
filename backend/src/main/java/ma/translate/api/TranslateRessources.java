package ma.translate.api;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ma.translate.models.TranslationRequest;
import ma.translate.services.GeminiService;

@Path("translate")
public class TranslateRessources {
	
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public Response translateShort(@QueryParam("text") String text, @QueryParam("sourceLang") String source, @QueryParam("targetLang") String target) {
		// Validate params
	    if (source == null || source.trim().isEmpty()) {
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("{\"error\":\"sourceLang is required\"}")
	                .build();
	    }	

	    if (target == null || target.trim().isEmpty()) {
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("{\"error\":\"targetLang is required\"}")
	                .build();
	    }
		
		if (text == null || text.trim().isEmpty()) {
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("{\"error\":\"text cannot be empty\"}")
	                .build();
	    }
		
		// Count words
	    int wordCount = text.trim().split("\\s+").length;
	    if (wordCount > 20) {
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("{\"error\":\"Text too long for GET. Use POST instead.\"}")
	                .build();
	    }
		
	    TranslationRequest request = new TranslationRequest(source, target, text);
		GeminiService service = new GeminiService();
		
		
		return Response.ok(service.translate(request)).build();
		
	}
	
	
	@POST		
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response translateLong(TranslationRequest request) {
		
		if (request.getSourceLang() == null || request.getSourceLang().trim().isEmpty()) {
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("{\"error\":\"sourceLang is required\"}")
	                .build();
	    }

	    if (request.getTargetLang() == null || request.getTargetLang().trim().isEmpty()) {
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("{\"error\":\"targetLang is required\"}")
	                .build();
	    }
	    
		if (request.getText() == null || request.getText().trim().isEmpty()) {
	        return Response.status(Response.Status.BAD_REQUEST)
	                .entity("{\"error\":\"text cannot be empty\"}")
	                .build();
	    }

	    GeminiService service = new GeminiService();
	    return Response.ok(service.translate(request)).build();
		
	}
	
	
	@GET
	@Path("audio")  
    @Produces("audio/wav")
	public Response synthesizeAudio(@QueryParam("text") String text, @QueryParam("lang") String lang) {
		 // Audio (better have a premium account for audio 😂 free tier is only 15 call)
		try {
			GeminiService service = new GeminiService();
            if (text == null || text.isBlank()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Missing 'text' query parameter")
                        .type(MediaType.TEXT_PLAIN)
                        .build();
            }

            byte[] wavBytes = service.textToSpeech(text, lang);

            return Response.ok(wavBytes)
                    .header("Content-Disposition", "inline; filename=\"tts.wav\"")
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError()
                    .entity("Error generating TTS: " + e.getMessage())
                    .type(MediaType.TEXT_PLAIN)
                    .build();
        }
		
	}
	
	
	
	

}
