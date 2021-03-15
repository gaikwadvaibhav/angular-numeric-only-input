import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular 5";

  myForm: FormGroup;

  amount: string;
  min = 0;
  max = 10;
  decimalPattern = new RegExp("[0-9]+([.][0-9]+)?");
  // pattern = "";

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      mood: ["", [Validators.required]],
      weight: ["", [Validators.required]]
    });
  }
  // numberOnly(event): boolean {
  //   console.log(event)
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   console.log(charCode)
  //   if ((charCode > 48 && charCode < 57)) {
  //     return true;
  //   }
  //   return false;

  // }

  numberOnly(event?, value?) {}
}
