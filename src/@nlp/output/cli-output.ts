import { SentenceType } from "../enums/sentence-types";
import { Sentence } from "../languages/universal/orthography/model/sentence";
import { Text } from "../languages/universal/orthography/model/text";

export class CliOutput {

  static echoAll(text: Text) {
    this.echoOverview(text);
    this.echoSentences(text);
  }

  static echoOverview(text: Text) {
    console.log("| Text:", text.string);
    console.log("Počet vět:", text.sentences.length);
    console.log("Počet slov:", text.words.length);
  }

  static echoSentences(text: Text) {
    for (const sentence of text.sentences) {
      console.log("-----");
      CliOutput.echoSentence(sentence);
    }
  }

  static echoSentence(sentence: Sentence) {
    console.log("| Věta:", sentence.string);

    console.log("Typ věty:", CliOutput.translateSentenceType(sentence.sentenceType));
    console.log("Počet slov:", sentence.words.length);
    console.log("Slova:", sentence.words.map(word => `${word.string} ${JSON.stringify(word.tags)}`));
  }

  static translateSentenceType(sentenceType: SentenceType) {
    switch (sentenceType) {
      case SentenceType.SAYING:
        return "Oznamovací";
      case SentenceType.COMMAND:
        return "Rozkazovací";
      case SentenceType.WISH:
        return "Přací";
      case SentenceType.QUESTION:
        return "Tázací";
    }
    return "(?) Neznámý";
  }

}
