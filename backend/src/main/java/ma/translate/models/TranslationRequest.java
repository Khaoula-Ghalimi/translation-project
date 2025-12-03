package ma.translate.models;

public class TranslationRequest {
	private String sourceLang;
    private String targetLang;
    private String text;
    
    
    public TranslationRequest() {
		
    }

    
	public TranslationRequest(String sourceLang, String targetLang, String text) {
		super();
		this.sourceLang = sourceLang;
		this.targetLang = targetLang;
		this.text = text;
	}


	public String getSourceLang() {
		return sourceLang;
	}


	public void setSourceLang(String sourceLang) {
		this.sourceLang = sourceLang;
	}


	public String getTargetLang() {
		return targetLang;
	}


	public void setTargetLang(String targetLang) {
		this.targetLang = targetLang;
	}


	public String getText() {
		return text;
	}


	public void setText(String text) {
		this.text = text;
	}
}
