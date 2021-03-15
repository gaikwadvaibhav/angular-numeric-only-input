import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges
} from "@angular/core";

@Directive({
  selector: "[digitOnly]"
})
export class DigitOnlyDirectiveDirective implements OnChanges {
  private hasDecimalPoint = false;
  private navigationKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "Home",
    "End",
    "ArrowLeft",
    "ArrowRight",
    "Clear",
    "Copy",
    "Paste"
  ];

  @Input() decimal = false;
  @Input() decimalSeparator = ".";
  @Input() min = -Infinity;
  @Input() max = Infinity;
  @Input() pattern?: string | RegExp;
  private regex: RegExp;
  inputElement: HTMLInputElement;

  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  ngOnChanges(changes): void {
    if (changes.pattern) {
      this.regex = this.pattern ? RegExp(this.pattern) : null;
    }
    if (changes.min) {
      const maybeMin = Number(this.min);
      this.min = isNaN(maybeMin) ? -Infinity : maybeMin;
    }

    if (changes.max) {
      const maybeMax = Number(this.max);
      this.max = isNaN(maybeMax) ? Infinity : maybeMax;
    }
  }

  @HostListener("keydown", ["$event"])
  onKeyDown(e: KeyboardEvent): any {
    if (
      this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      ((e.key === "a" || e.code === "KeyA") && e.ctrlKey === true) || // Allow: Ctrl+A
      ((e.key === "c" || e.code === "KeyC") && e.ctrlKey === true) || // Allow: Ctrl+C
      ((e.key === "v" || e.code === "KeyV") && e.ctrlKey === true) || // Allow: Ctrl+V
      ((e.key === "x" || e.code === "KeyX") && e.ctrlKey === true) || // Allow: Ctrl+X
      ((e.key === "a" || e.code === "KeyA") && e.metaKey === true) || // Allow: Cmd+A (Mac)
      ((e.key === "c" || e.code === "KeyC") && e.metaKey === true) || // Allow: Cmd+C (Mac)
      ((e.key === "v" || e.code === "KeyV") && e.metaKey === true) || // Allow: Cmd+V (Mac)
      ((e.key === "x" || e.code === "KeyX") && e.metaKey === true) // Allow: Cmd+X (Mac)
    ) {
      // let it happen, don't do anything
      return;
    }

    let newValue = "";

    if (this.decimal && e.key === this.decimalSeparator) {
      newValue = this.forecastValue(e.key);
      if (newValue.split(this.decimalSeparator).length > 2) {
        // has two or more decimal points
        e.preventDefault();
        return;
      } else {
        this.hasDecimalPoint = newValue.indexOf(this.decimalSeparator) > -1;
        return; // Allow: only one decimal point
      }
    }

    // Ensure that it is a number and stop the keypress
    if (e.key === " " || isNaN(Number(e.key))) {
      e.preventDefault();
      return;
    }

    newValue = newValue || this.forecastValue(e.key);
    console.log("newValue", newValue);
    // check the input pattern RegExp
    if (this.regex) {
      if (!this.regex.test(newValue)) {
        e.preventDefault();
        return;
      }
    }

    const newNumber = Number(newValue);
    if (newNumber > this.max || newNumber < this.min) {
      e.preventDefault();
    }
  }

  private forecastValue(key: string): string {
    console.log("key", key);
    const selectionStart = this.inputElement.selectionStart;
    console.log("selectionStart", selectionStart);
    const selectionEnd = this.inputElement.selectionEnd;
    console.log("selectionEnd", selectionEnd);
    const oldValue = this.inputElement.value;
    console.log("oldValue", oldValue);
    const selection = oldValue.substring(selectionStart, selectionEnd);
    return selection
      ? oldValue.replace(selection, key)
      : oldValue.substring(0, selectionStart) +
          key +
          oldValue.substring(selectionStart);
  }
}
