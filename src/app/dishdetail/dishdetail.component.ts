import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Dish } from "../shared/dish";
import { DishService } from "../services/dish.service";
import { switchMap } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Comment } from "../shared/comment";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"]
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;

  commentForm: FormGroup;
  comment: Comment;

  dishCopy: Dish;

  formErrors = {
    author: "",
    comment: ""
  };

  validationMessages = {
    author: {
      required: "Author Name is required.",
      minlength: "Author Name must be at least 2 characters long.",
      maxlength: "Author Name cannot be more than 25 characters long."
    },
    comment: {
      required: "Comment is required.",
      minlength: "Comment must be at least 1 characters long."
    }
  };

  @ViewChild("cform") commentFormDirective; //to ensure form is completely reset to its value

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject("BaseURL") private BaseURL
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => {
      this.dishIds = dishIds;
    });

    this.route.params
      .pipe(
        switchMap((params: Params) => this.dishService.getDish(params["id"]))
      )
      .subscribe(
        dish => {
          this.dish = dish;
          this.dishCopy = dish;
          this.setPrevNext(dish.id);
        },
        errMess => (this.errMess = <any>errMess)
      );
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
      ],
      comment: ["", [Validators.required, Validators.minLength(1)]],
      rating: 5
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) return;
    const form = this.commentForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = "";
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + " ";
        }
      }
    }
    this.comment = form.value;
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dishCopy.comments.push(this.comment);
    this.dishService.putDish(this.dishCopy).subscribe(
      dish => {
        this.dish = dish;
        this.dishCopy = dish;
      },
      errMess => {
        this.dish = null;
        this.dishCopy = null;
        this.errMess = <any>errMess;
      }
    );
    console.log(this.comment);
    this.comment = null;
    // this.commentForm.reset({
    //   author: "",
    //   comment: "",
    //   rating: 5
    // });
    this.commentFormDirective.resetForm();
  }
}
