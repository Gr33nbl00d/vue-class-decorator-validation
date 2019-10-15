

# vue-class-decorator-validation
<b>Next generation decorator based Validation Framework</b>

Use decorators to define how your editable properties should be validated.
The validation classes can also be used on server side without any dependency to vue.

STILL ALPHA!
## Installation
<b>Install packages with</b>
npm install vue-class-decorator-validation themis-validation-rules-common --save

## Integration via mixin or global mixin

**Mixin definition:**
```typescript
@Component({mixins: [AnnotationValidationMixin]})
export default class MyComponentClass extends VueControllerNew {
```

## Example:
<b>Vue HTML CODE:</b>
```vue
<template>
    <v-text-field v-model="myText" :error-messages="viewValidation.getFieldErrorTexts('myText',textProcessor)"/>
    <!-- Get all errormessages for the field "myText", use the textProcessor to translate string constants to localized messages -->
</template>
```

<b>Vue Typescript CODE:</b>
```typescript
//Mixin definition
@Component({mixins: [AnnotationValidationMixin]})
export default class MyComponentClass {
    
  //Validation rule definition for myText property
  @Validate(new Validator([new MandatoryRule()]))
  private myText: string;
  private viewValidation: VueControllerValidation;

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
    //programatically check if any property is invalid
    if (this.viewValidation.isComponentInvalid() == false) {
      //save data
    }
}
```

##JSFiddle
[JSFiddle](https://jsfiddle.net/mjtk3dhs/)

## ValidationRules

Consist of an errorTextTemplate which will be given to your I18N framework to be translated to a displayable text and a method to validate the value.

```typescript
export class MandatoryRule extends ValidationRule {

    //validation_input_required can be translated to localised text 
    //or error codes on server side
    getErrorTextTemplate(): string {
        return "validation_input_required";
    }
	
	// method to check the value
    isValid(value): boolean {

        return value != undefined && value != null  && value != "";
    }
}
```

## Validator

A validator contains multiple rules which are needed to validate an object.

**On the fly validator definition**
Validators can be defined on the fly inside the annotation
```typescript
@Validate(new Validator([new MandatoryRule(),new RegExRule("[A-Z]*","big_letter_rule")]))
```

**Predefined Validators (can also be reused on backend side)**
If values need to be checked on multiple components and also on the backend,
it makes sense to create an own class for this specific rule set.
This validator can than easily be reused on different components and also on the backend.

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
    
  @Validate(new UsernameValidator())
  private userName: string;  

  constructor() {
    super();
  } 
}

```


## Validation Groups
Often it is needed to group validators. For example enable validation for one or more properties if a checkbox is marked.
The @Validate decorator has a second argument which contains MetaData for this validation. The metadata object can also be used to define custom meta data like i18n prefixes or anything else you need to know to display the correct information to the user.

```typescript
@Validate(new Validator([new MandatoryRule()]), {groupName: 'registration'})
private lastName: string;
```

```typescript
private registrationCheckboxChanged(selected:boolean) {
	if (selected)
		this.viewValidation.enableGroup('registration');
	else
		this.viewValidation.disableGroup('registration');
}
```

## Inspect/Read Validation Errors

```typescript
//returns true if any property which is in an enabled group contains invalid data
isComponentInvalid(): boolean;

//returns a list or errrors containing metadata and rules that failed
getComponentErrors(): Array<ValidatorError>;

//returns a list or errrors containing metadata and rules that failed
//mandatory rules will be filtered out
getComponentErrosWithoutMandatoryRules(): Array<ValidatorError>

//returns all errors for a specific field/property
getFieldErrors(fieldName): Array<ValidatorError>;

//returns a list of errortexts (convenience method)
getFieldErrorTexts(fieldName: string, textProcessor: TextTemplateProcessor): Array<String>;

//returns true if any rule does not match
isFieldInvalid(fieldName): boolean;

//Possibility to check specific values for a specific field
isFieldInvalidWithValue(fieldName, value): boolean;

//disable a specific group of validators
disableGroup(groupName: string);

//enable a specific group of validators
enableGroup(groupName: string);

//enables all groups
clearDisabledGroups();
```
