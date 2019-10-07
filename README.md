# vue-class-decorator-validation

Use decorators to define how your editable properties should be validated.
The validation classes can also be used on server side without any dependency to vue.

STILL ALPHA!


<b>Vue HTML CODE:</b>
```vue
<template>
    <v-text-field v-model="myText" :error-messages="viewValidation.getFieldErrorTexts('myText',textProcessor)"/>
</template>
```

<b>Vue Typescript CODE:</b>
```typescript
@Component({mixins: [AnnotationValidationMixin]})
export default class MyComponentClass extends VueControllerNew {
    
  @Validate(new Validator([new MandatoryRule()]))
  private myText: string;
  private controllerValidation: VueControllerValidation;

  constructor() {
    super();
    //For Internationalization use here your favorite I18N Framework
    this.textProcessor = {
      processText(errorTextTemplate: string, object: any): string {
        return errorTextTemplate;
      }
    }
  }
  
  save() {
    if (this.controllerValidation.isComponentInvalid() == false) {
      //save data
    }
}
```



<b>ValidationRules</b>
Consist of an errorTextTemplate which will be given to your used I18N framework to be translated to a displayable text
and a method for validation the value.

```typescript
export class MandatoryRule extends ValidationRule {

    getErrorTextTemplate(): string {
        return "validation_input_required";
    }

    isValid(value): boolean {

        return value != undefined && value != null  && value != "";
    }
}
```

<B>Validator<B>
A validator contains multiple rules which are needed to validate an object.
<b>On the fly validator definition</b>
```typescript
@Validate(new Validator([new MandatoryRule(),new RegExRule("[A-Z]*","big_letter_rule")]))
```

<b>Predefined Validators (can also be used on backend side)</b>

```typescript
import {Validator} from "themis-validation-core";
import {MandatoryRule, MaxLengthRule, MinLengthRule} from "themis-validation-rules-common";

const USERNAME_MIN_LENGTH = 4;
const USERNAME_MAX_LENGTH = 16;

export default class UsernameValidator extends Validator {

    constructor() {
        super();
        this.validationRules.push(new MandatoryRule());
        this.validationRules.push(new MinLengthRule(USERNAME_MIN_LENGTH));
        this.validationRules.push(new MaxLengthRule(USERNAME_MAX_LENGTH));

    }

}

@Component({mixins: [AnnotationValidationMixin]})
export default class MyComponentClass {
    
  // fielddesc is used for custom i18n texts
  @Validate(new UsernameValidator(), {fielddesc: "username"})
  private userName: string;  

  constructor() {
    super();
  } 
}

```
