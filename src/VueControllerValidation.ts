import {
    DirectRetriever,
    FieldScopeFilter,
    ObjectValidation,
    ObjectValidationConfig, TextTemplateProcessor,
    ValidatorError,
    ValueRetriever,
    NotInDisabledGroupScopeFilter, AndScopeFilter
} from "themis-validation-core";
import {MandatoryRuleFilter} from "themis-validation-rules-common-filter";



export class VueControllerValidation extends ObjectValidation {

    private defaultValueRetriever: ValueRetriever;
    private disabledGroups: Array<string> = [];

    public init(defaultValueRetriever: ValueRetriever, objectValidationConfig: ObjectValidationConfig) {
        this.defaultValueRetriever = defaultValueRetriever
        this.objectValidationConfig = objectValidationConfig;
    }

    isComponentInvalid(): boolean {
        return this.objectValidationConfig.isInvalid(this.defaultValueRetriever, new NotInDisabledGroupScopeFilter(this.disabledGroups));
    }

    getComponentErrors(): Array<ValidatorError> {
        return this.objectValidationConfig.getErrors(this.defaultValueRetriever, new NotInDisabledGroupScopeFilter(this.disabledGroups));
    }

    getComponentErrosWithoutMandatoryRules(): Array<ValidatorError> {
        return this.objectValidationConfig.getErrors(this.defaultValueRetriever, new NotInDisabledGroupScopeFilter(this.disabledGroups), new MandatoryRuleFilter())
    }

    getFieldErrors(fieldName): Array<ValidatorError> {
        let fieldScopeFilter = new FieldScopeFilter(fieldName);
        let filter = new AndScopeFilter(fieldScopeFilter, new NotInDisabledGroupScopeFilter(this.disabledGroups));
        return this.objectValidationConfig.getErrors(this.defaultValueRetriever, filter);
    }

    getFieldErrorTexts(fieldName: string, textProcessor: TextTemplateProcessor): Array<String> {
        let fieldErrors = this.getFieldErrors(fieldName);

        var errorMessages: Array<String> = [];
        for (const fieldError of fieldErrors) {

            for (const validationRuleError of fieldError.getRuleErrors()) {
                errorMessages.push(validationRuleError.getErrorText(textProcessor));
            }
        }
        return errorMessages;
    }


    isFieldInvalid(fieldName): boolean {
        let fieldScopeFilter = new FieldScopeFilter(fieldName);
        let filter = new AndScopeFilter(fieldScopeFilter, new NotInDisabledGroupScopeFilter(this.disabledGroups));
        return this.objectValidationConfig.isInvalid(this.defaultValueRetriever, filter);
    }

    isFieldInvalidWithValue(fieldName, value): boolean {
        let fieldScopeFilter = new FieldScopeFilter(fieldName);
        let filter = new AndScopeFilter(fieldScopeFilter, new NotInDisabledGroupScopeFilter(this.disabledGroups));
        return this.objectValidationConfig.isInvalid(new DirectRetriever(value), filter);
    }

    disableGroup(groupName: string) {
        this.disabledGroups.push(groupName);
    }

    enableGroup(groupName: string) {
        this.disabledGroups = this.disabledGroups.filter(obj => obj !== groupName);
    }

    clearDisabledGroups() {
        this.disabledGroups = [];
    }
}
