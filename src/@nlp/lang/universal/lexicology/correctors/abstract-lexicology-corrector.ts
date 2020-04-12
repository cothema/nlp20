import { IStringableEditableToken } from "../../../../shared/interfaces/IStringableEditableToken";
import { ModifiableToken } from "../../../../shared/model/ModifiableToken";
import { LexicologyErrorType } from "../enums/lexicology-error-type";
import { LexicologyError } from "../model/lexicology-error";

export abstract class AbstractLexicologyCorrector<T extends IStringableEditableToken = IStringableEditableToken> {
  errors: LexicologyError[] = [];
  provideTokenInfo = true;
  fixInOriginalString = true;

  abstract fixAll(): this;

  constructor(
    protected entity: T,
  ) {
  }

  public getEntity(): T {
    return this.entity;
  }

  protected fixByMultipleRegExps(
    matchRegExps: { regExp: RegExp, replace?: string }[],
    lexicologyError: LexicologyErrorType = LexicologyErrorType.UNSPECIFIED,
  ): this {
    for (const matchRegExp of matchRegExps) {
      this.fixByRegExp(
        matchRegExp.regExp,
        matchRegExp.replace || "",
        lexicologyError,
      );
    }
    return this;
  }

  protected fixByRegExp(
    matchRegExp: RegExp,
    replaceWith: string = "",
    lexicologyError: LexicologyErrorType = LexicologyErrorType.UNSPECIFIED,
  ): this {
    const str: string = this.entity.toString()
      .replace(matchRegExp, replaceWith);

    let match;
    while ((match = matchRegExp.exec(this.entity.toString())) != null) {
      let tokenInfo = new ModifiableToken({
        originalLength: match[0].length,
        originalIndex: match.index,
        newLength: replaceWith.length,
        newIndex: match.index,
      });

      this.fixInOriginalIfAllowed(
        str,
        lexicologyError,
        tokenInfo,
      );
    }

    return this;
  }

  protected fixInOriginalIfAllowed(
    newString: string,
    error: LexicologyErrorType,
    tokenInfo?: ModifiableToken,
  ): this {
    if (this.entity.toString() !== newString) {
      // There were some corrections.

      let lexicologyError = new LexicologyError({
        type: error,
      });

      if (tokenInfo && this.provideTokenInfo) {
        lexicologyError.tokenInfo = tokenInfo;
      }

      this.errors.push(lexicologyError);

      if (!this.fixInOriginalString) {
        // We will return new sentence
        // out.tokenInfo will have the same pointer as original!
        const out = this.newEntityFactory(original);
        out.string = newString;
        return out;
      }
    }

    // No changes or this.fixInOriginalString is true
    return this;
  }
}
