import {VueControllerValidation} from "./VueControllerValidation";
import {DefaultInstanceFieldRetriever, ObjectValidationConfig} from "themis-validation-core";

export const AnnotationValidationMixin = {
    data() {
        return {
            viewValidation: new VueControllerValidation()
        }

    },
    created() {
        // @ts-ignore
        var objectValidationConfig = this.$options.vueComponentValidationConfig;
        if(!objectValidationConfig)
        {
            objectValidationConfig = new ObjectValidationConfig();
        }
        (this as any).viewValidation.init(new DefaultInstanceFieldRetriever(this), objectValidationConfig);
    }
}
