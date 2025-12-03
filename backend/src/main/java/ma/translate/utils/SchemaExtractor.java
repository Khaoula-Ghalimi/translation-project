package ma.translate.utils;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.google.genai.types.Schema;
import com.google.genai.types.Type;

public class SchemaExtractor<T> {

	// Class<T> clazz is equivilant to the typeof the class
	// well using it is better than getting the object then doing .class
	public Map<String, Schema> extractSchema(Class<?> class1) {
		Map<String, Schema> schemaMap = new LinkedHashMap<>();

		for (Field field : class1.getDeclaredFields()) {
			field.setAccessible(true);

			// Determine schema type based on Java type
			Type.Known type = mapJavaTypes(field.getType());
			System.out.println(field.getName() + " " + type + " " + field.getType().isEnum());

			// Read @Description annotation if present
			Description desc = field.getAnnotation(Description.class);
			String description = desc != null ? desc.value() : "";

			Schema schema;

			if (type == Type.Known.ARRAY) {

				Class<?> elementClass = null;

				// 1) If it's an array: MyType[]
				if (field.getType().isArray()) {
					elementClass = field.getType().getComponentType();
				}
				// 2) If it's some kind of List / Collection: List<MyType>
				else if (List.class.isAssignableFrom(field.getType())) {
					java.lang.reflect.Type genericType = field.getGenericType();

					if (genericType instanceof ParameterizedType paramType) {
						java.lang.reflect.Type actualType = paramType.getActualTypeArguments()[0];

						if (actualType instanceof Class<?>) {
							elementClass = (Class<?>) actualType;
						} else {
							// Something like List<Map<String, Object>> — fallback
							elementClass = Object.class;
						}
					} else {
						// Raw List with no generics: List items;
						elementClass = Object.class;
					}
				}

				// Fallback if somehow still null
				if (elementClass == null) {
					elementClass = Object.class;
				}

				// Build inner schema depending on element type
				Type.Known elementType = mapJavaTypes(elementClass);
				Schema innerSchema;

				if (elementClass.isEnum()) {
					// Array of enums
					List<String> enumValues = new ArrayList<>();
					Object[] constants = elementClass.getEnumConstants();

					if (constants != null) {
						for (Object enumConstant : constants) {
							try {
								Method m = elementClass.getMethod("getDisplayValue");
								String v = (String) m.invoke(enumConstant);
								enumValues.add(v);
							} catch (Exception e) {
								enumValues.add(enumConstant.toString());
							}
						}
					}

					innerSchema = Schema.builder().type(Type.Known.STRING).enum_(enumValues).build();

				} else if (elementType == Type.Known.OBJECT && !elementClass.isEnum()) {
					// Array/List of your own POJO → recurse
					innerSchema = Schema.builder().type(Type.Known.OBJECT).properties(extractSchema(elementClass))
							.build();
				} else {
					// Array/List of primitive / String / number
					innerSchema = Schema.builder().type(elementType).build();
				}

				schema = Schema.builder().type(Type.Known.ARRAY).description(description).items(innerSchema).build();
			} else if (type == Type.Known.OBJECT && field.getType().isEnum()) {
				List<String> enumValues = new ArrayList<>();

				Object[] constants = field.getType().getEnumConstants();
				for (Object enumConstant : constants) {
					try {
						Method m = field.getType().getMethod("getDisplayValue");
						String v = (String) m.invoke(enumConstant);
						enumValues.add(v); // use the display value
					} catch (Exception e) {
						enumValues.add(enumConstant.toString()); // fallback
					}
				}

				schema = Schema.builder().type(Type.Known.STRING).description(description).enum_(enumValues).build();
			} else {
				schema = Schema.builder().type(type).description(description).build();
			}

			schemaMap.put(field.getName(), schema);

		}

		return schemaMap;

	}

	public static List<String> extractRequiredFields(Class<?> clazz) {
		List<String> requiredFields = new ArrayList<>();

		for (Field field : clazz.getDeclaredFields()) {
			if (field.isAnnotationPresent(Required.class)) {
				requiredFields.add(field.getName());
			}
		}

		return requiredFields;
	}

	private Type.Known mapJavaTypes(Class<?> javaType) {

		if (javaType == String.class)
			return Type.Known.STRING;

		if (javaType == int.class || javaType == Integer.class)
			return Type.Known.INTEGER;

		// detect ANY number type (float, double, long, short, byte)
		if (Number.class.isAssignableFrom(javaType)
				|| javaType.isPrimitive() && (javaType == float.class || javaType == double.class
						|| javaType == long.class || javaType == short.class || javaType == byte.class))
			return Type.Known.NUMBER;

		if (javaType == boolean.class || javaType == Boolean.class)
			return Type.Known.BOOLEAN;

		if (List.class.isAssignableFrom(javaType) || javaType.isArray())
			return Type.Known.ARRAY;

		if (Map.class.isAssignableFrom(javaType) || !javaType.isPrimitive())
			return Type.Known.OBJECT;

		// fallback
		return Type.Known.TYPE_UNSPECIFIED;
	}

}
