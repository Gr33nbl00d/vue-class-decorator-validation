import {createDecorator} from "vue-class-component";
import {ObjectValidationConfig, Validator} from "themis-validation-core";


export function Validate(validator: Validator, metadata?: any): PropertyDecorator {
    let vueDecorator: any = createDecorator((componentOptions, k) => {
        // @ts-ignore
        var viewValidation = componentOptions.vueComponentValidationConfig;
        if (!viewValidation) {
            viewValidation = new ObjectValidationConfig();
            // @ts-ignore
            componentOptions.vueComponentValidationConfig=viewValidation;
        }
        if (!metadata) {
            metadata = {}
        }
        metadata.fieldname = k;
        viewValidation.addValidator(validator, metadata);
    });
    return vueDecorator;
}
