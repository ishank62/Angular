import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Feedback, ContactType } from "../shared/feedback";
import { FeedbackService } from "../services/feedback.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackCopy: Feedback;
  contacttype = ContactType;
  spinnerVisibility: boolean = false;

  formErrors = {
    firstname: "",
    lastname: "",
    telnum: "",
    email: ""
  };

  validationMessages = {
    firstname: {
      required: "First name is required.",
      minlength: "First name must be atleast 2 characters long.",
      maxlength: "First name cannot be more than 25 characters long."
    },
    lastname: {
      required: "Last name is required.",
      minlength: "Last name must be atleast 2 characters long.",
      maxlength: "Last name cannot be more than 25 characters long."
    },
    telnum: {
      required: "Tel. number is required.",
      pattern: "Tel. number must contain only numbers."
    },
    email: {
      required: "Email is required.",
      email: "Email is not in valid format."
    }
  };

  @ViewChild("fform") feedbackFormDirective; //to ensure form is completely reset to its value

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(10)]
      ],
      lastname: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(10)]
      ],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ["", [Validators.required, Validators.email]],
      agree: false,
      contacttype: "None",
      message: ""
    });

    this.feedbackForm.valueChanges.subscribe(data => {
      this.onValueChanged(data);
    });

    this.onValueChanged(); //reset form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) return;
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + "";
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.spinnerVisibility = true;
    this.feedbackCopy = this.feedbackForm.value;
    this.feedbackService.postFeedback(this.feedbackCopy).subscribe(feedback => {
      this.feedback = feedback;
      this.spinnerVisibility = false;
      console.log(this.feedback);
      setTimeout(() => (this.feedback = null), 10000);
    });
    this.feedbackForm.reset({
      firstname: "",
      lastname: "",
      telnum: 0,
      email: "",
      agree: false,
      contacttype: "None",
      message: ""
    });
    this.feedbackFormDirective.resetForm();
  }
}
