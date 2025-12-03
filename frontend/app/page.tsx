"use client"

import LanguageTabs from "@/components/home/LanguageTabs";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios-client";
import { ChevronRight, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

import ScoreBadge from "@/components/ui-custom/ScoreBadge";
import { playAudioBlob } from "@/utils/AudioUtils";
import { getDirection, getPlaceHolders } from "@/utils/LangagesUtils";
import { AlternativeType, TranslationResponseType } from "@/types/TranslationResponseType";
import { TranslationRequest } from "@/types/TranslationRequestType";
import AlternativeBadge from "@/components/ui-custom/AlternativeBadge";

// Count words in a given text
function countWords(text: string) {
  return text.trim().split(/\s+/).length;
}

// Translate function using GET for short texts and POST for longer texts
async function translate(sourceLang: string, targetLang: string, text: string) {
  const words = countWords(text);

  if (words < 20) {
    try {
      const response = await api.get("/translate", {
        params: {
          sourceLang,
          targetLang,
          text
        }
      });
      return response.data;
    } catch (error) {
      console.error("GET ERROR:", error);
      throw error;
    }

  } else
    try {
      const response = await api.post("/translate", {
        sourceLang,
        targetLang,
        text
      });

      return response.data;
    } catch (error) {
      console.error("POST ERROR:", error);
      throw error;
    }
}

// Fetch TTS audio for given text
async function fetchTtsAudio(text: string): Promise<Blob | null> {
  if (!text.trim()) return null;
  const response = await api.get("/translate/audio", {
    params: {
      text,
    },
    responseType: "blob",
  });

  return response.data as Blob;
}



export default function Home() {
  const [translationRequest, setTranslationRequest] = useState<TranslationRequest>({
    sourceLang: "English",
    targetLang: "Moroccan Darija (AR Aplhabet)",
    text: ""
  });
  const [translationResponse, setTranslationResponse] = useState<TranslationResponseType | null>(null);





  // Audio blobs(better have a premium account for audio 😂 free tier is only 15 call)
  // const [sourceAudio, setSourceAudio] = useState<Blob | null>(null);
  // const [targetAudio, setTargetAudio] = useState<Blob | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  function setSourceLang(lang: string) {
    setTranslationRequest(prev => ({
      ...prev,
      sourceLang: lang
    }));
  }

  function setTargetLang(lang: string) {
    setTranslationRequest(prev => ({
      ...prev,
      targetLang: lang
    }));
  }
  function setInputText(text: string) {
    setTranslationRequest(prev => ({
      ...prev,
      text: text
    }));
  }

  async function handleTranslate() {
    try {
      setLoading(true);
      setAudioLoading(true);

      const result = await translate(
        translationRequest.sourceLang,
        translationRequest.targetLang,
        translationRequest.text
      );

      // normalize translatedText field
      const translated = result.translatedText ?? result.translation ?? "";

      // Prepare audio promises: source + target + alternatives
      const audioPromises: Promise<Blob | null>[] = [
        fetchTtsAudio(translationRequest.text), // source
        fetchTtsAudio(translated),             // target
      ];

      const alternativesFromApi = (result.alternatives ?? []) as AlternativeType[];

      for (const alt of alternativesFromApi) {
        audioPromises.push(fetchTtsAudio(alt.alternativeText));
      }

      let sourceAudio: Blob | null = null;
      let targetAudio: Blob | null = null;
      let alternativesWithAudio: AlternativeType[] = alternativesFromApi;

      try {
        const audioResults = await Promise.all(audioPromises);

        sourceAudio = audioResults[0];
        targetAudio = audioResults[1];

        if (alternativesFromApi.length > 0) {
          const altAudios = audioResults.slice(2); // rest = alternatives
          alternativesWithAudio = alternativesFromApi.map((alt, idx) => ({
            ...alt,
            audio: altAudios[idx] ?? undefined,
          }));
        }
      } catch (ttsError) {
        console.error("TTS preload error:", ttsError);
      } finally {
        setAudioLoading(false);
      }

      // Build the final response object with audio inside
      const fullResponse: TranslationResponseType = {
        ...result,
        translatedText: translated,             // ensure it always exists
        sourceAudio: sourceAudio ?? undefined,
        targetAudio: targetAudio ?? undefined,
        alternatives: alternativesWithAudio,
      };

      setTranslationResponse(fullResponse);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setLoading(false);
    }
  }


  const groupedAlternativesByMeaning =
    translationResponse?.meanings?.map((meaning, meaningIndex) => ({
      meaning,
      meaningIndex,
      alternatives:
        translationResponse.alternatives?.filter(
          (alt) => {
            console.log("Checking alternative:", alt.id_meaning, "for meaning index:", meaningIndex);
            return alt.id_meaning === meaningIndex;
          }
        ) ?? [],
    })) ?? [];


  useEffect(() => {
    console.log("Translation Response Updated:", translationResponse);
    console.log("Grouped Alternatives:", groupedAlternativesByMeaning);
  }, [translationResponse]);



  return (
    <div className="mx-auto px-6 max-w-7xl mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <LanguageTabs defaultLanguage="English" selected={translationRequest.sourceLang} setSelected={setSourceLang} />
          <div className="flex flex-col h-52">
            <Textarea
              maxLength={250}
              dir={getDirection(translationRequest.sourceLang)}
              placeholder={getPlaceHolders(translationRequest.sourceLang, true)}
              value={translationRequest.text}
              onChange={(e) => setInputText(e.target.value)}
              className="shadow-none resize-none rounded-b-none overflow-y-auto overflow-x-hidden flex-1 focus-visible:ring-0 text-xl!"
            />
            <div className="flex justify-between border border-t-0 rounded-b-md items-center py-2 px-3 bg-muted/50">
              <div className="flex items-center gap-4">
                <Button
                  size={"icon-lg"}
                  variant={"ghost"}
                  disabled={!translationResponse?.sourceAudio || audioLoading}
                  onClick={() => playAudioBlob(translationResponse?.sourceAudio || null)}
                  className="disabled:cursor-not-allowed">
                  <Volume2 className="inline-block size-5 text-muted-foreground" />
                </Button>
                {
                  translationResponse && translationResponse.suggestedLanguage !== "" && translationResponse.suggestedLanguage !== translationRequest.sourceLang && (
                    <div className="text-sm text-muted-foreground flex items-center">

                      <span>Suggested :</span>
                      <Button
                        size={"sm"}
                        variant="ghost"
                        onClick={() => {
                          setSourceLang(translationResponse.suggestedLanguage);      // change the source language
                          if (translationRequest.text.trim()) {
                            // optional: instantly re-translate with the corrected language
                            handleTranslate();
                          }
                        }}
                      >
                        {translationResponse.suggestedLanguage}
                      </Button>
                    </div>
                  )
                }
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-sm text-muted-foreground">
                  {translationRequest.text.length}/250
                </span>

                <Button
                  size={"sm"}
                  onClick={() => handleTranslate()}
                  asChild
                  className="cursor-pointer"
                >
                  <div>
                    Translate
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Button>
              </div>

            </div>
          </div>

        </div>
        <div className="flex flex-col gap-4">
          <LanguageTabs defaultLanguage="Moroccan Darija (AR Aplhabet)" selected={translationRequest.targetLang} setSelected={setTargetLang} />
          <div className="relative">
            {loading && (
              <div className="absolute w-full bg-muted top-0 left-0 h-full z-10 flex flex-col gap-2 items-center justify-center rounded-md text-gray-800 dark:text-white/70">
                <Spinner className="size-8" />
                Translation in progress...
              </div>
            )}
            <div className="relative">
              <Button
                size={"icon-lg"}
                variant={"ghost"}
                className="absolute bottom-2 left-3"
                disabled={!translationResponse?.targetAudio || audioLoading}
                onClick={() => playAudioBlob(translationResponse?.targetAudio || null)}>
                <Volume2 className="inline-block size-5 text-muted-foreground disabled:cursor-not-allowed" />
              </Button>
              <Textarea
                dir={getDirection(translationRequest.targetLang)}
                placeholder={getPlaceHolders(translationRequest.targetLang, false)}
                value={translationResponse?.translatedText || ""}
                readOnly
                className="resize-none overflow-y-auto overflow-x-hidden h-52 bg-muted/50 text-foreground/60 focus-visible:ring-0 text-xl!"
              />
            </div>
            {
              translationResponse?.translatedText && !loading && (
                <div className="absolute bottom-2 right-3">
                  {ScoreBadge(translationResponse.score)}
                </div>
              )
            }
          </div>
        </div>
        <div className=""></div>

        {!loading && translationResponse && (
          <div className="flex flex-col">
            <h2 className="text-md font-medium mb-4">Meanings & Alternatives</h2>

            {groupedAlternativesByMeaning.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No alternative meanings available.
              </p>
            )}

            {groupedAlternativesByMeaning.map((group) => {
              return (
                <div key={group.meaningIndex} className="mb-1">
                  {/* Meaning line */}
                  <div className=" mb-1 px-6">
                    <p className="text-foreground text-sm">
                      {group.meaningIndex + 1}. {group.meaning}
                    </p>
                  </div>

                  {/* Alternatives under this meaning */}
                  <div className="flex px-10 mb-1 gap-2 flex-wrap">
                    {group.alternatives.map((alt, idx) => (
                      <div key={idx} className="">
                        <AlternativeBadge text={alt.alternativeText} score={alt.score} onClick={() => playAudioBlob(alt.audio || null)}></AlternativeBadge>
                      </div>
                    ))}
                  </div >
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}







