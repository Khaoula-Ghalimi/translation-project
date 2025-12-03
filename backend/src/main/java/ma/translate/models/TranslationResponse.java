package ma.translate.models;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import ma.translate.utils.Description;
import ma.translate.utils.Language;
import ma.translate.utils.Required;

public class TranslationResponse {
	
	@Required
	@Description("the translated text")
	private String translatedText;
	
	@Required
	@Description("the quality score should be between 0 and 1")
	private float score;
	
	@Description("list of alternative translations with scores (if the text is a only one word or a term aka not a phrase or paragraph please give at least one or two alternative if possible)")
	private List<Alternative> alternatives;
	
	@Required
	@Description("the meaning of this word or the phrase (detailled and always in english)")
	private List<String> meanings;
	
	
    @Required
    @Description("suggested language (used usually to see if the user entered the wrong source lang so we give the right one)")
	private Language suggestedLanguage;

	
	public static class Alternative{
		
		@Description("an alternative translation")
		public String alternativeText;
		
		@Description("the quality score should be between 0 and 1")
	    public float score;
		
		@Description("the id in the list meanings that fit this alternative it should be equal to one of the meanings")
		public int id_meaning;
	}
	
	
	public TranslationResponse() {
		this.translatedText = "";
		this.score = 0;	
		this.alternatives = new ArrayList<Alternative>();
		this.meanings = new ArrayList<>();
	}

	
	public TranslationResponse(String translatedText, float score, List<String> meaning,List<Alternative> alternatives) {
		super();
		this.translatedText = translatedText;
		this.score = score;
		this.meanings = meaning;
		this.alternatives = alternatives;
	}
	
	


	public List<Alternative> getAlternatives() {
		return alternatives;
	}


	public void setAlternatives(List<Alternative> alternatives) {
		this.alternatives = alternatives;
	}


	public String getTranslatedText() {
		return translatedText;
	}


	public void setTranslatedText(String translatedText) {
		this.translatedText = translatedText;
	}


	public float getScore() {
		return score;
	}


	public void setScore(float score) {
		this.score = score;
	}


	public List<String> getMeanings() {
		return meanings;
	}


	public void setMeanings(List<String> meaning) {
		this.meanings = meaning;
	}


	public Language getSuggestedLanguage() {
		return suggestedLanguage;
	}


	public void setSuggestedLanguage(Language suggestedLanguage) {
		this.suggestedLanguage = suggestedLanguage;
	}
	
	
	
	
	
	 

}
