package ma.translate.utils;

import io.github.cdimascio.dotenv.Dotenv;


// this class is used to load .env 
// to load .env successfully please create /src/main/resources and put .env inside it
public class EnvConfig {
	
	public static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
	
	public static String get(String key) {
		return dotenv.get(key);
	}

}
