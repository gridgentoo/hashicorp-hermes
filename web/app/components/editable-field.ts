import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import { assert } from "@ember/debug";

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface EditableFieldComponentSignature {
  Element: HTMLDivElement;
  Args: {
    value: string;
    onChange?: (
      newValue: string | string[],
      cachedValue?: string | string[]
    ) => void;
  };
}

export default class EditableFieldComponent extends Component<EditableFieldComponentSignature> {
  @tracked editing = false;
  @tracked _parentDiv: HTMLDivElement | null = null;
  @tracked _editorDiv: HTMLDivElement | null = null;
  @tracked cachedValue = "";

  @action
  captureParentDiv(el: HTMLDivElement) {
    this._parentDiv = el;
  }

  @action
  captureEditorDiv(el: HTMLDivElement) {
    this._editorDiv = el;
  }

  get parentDiv(): HTMLDivElement {
    assert("_domElement is expected", this._parentDiv);
    return this._parentDiv;
  }

  get editorDiv(): HTMLDivElement {
    assert("_domElement is expected", this._parentDiv);
    return this._parentDiv;
  }

  @action
  edit() {
    this.cachedValue = this.args.value;
    this.editing = true;

    // Focus the first focusable element in the `<:editing>` block.
    scheduleOnce("afterRender", this, () => {
      if (!this.parentDiv.contains(document.activeElement)) {
        const firstInput = this.parentDiv.querySelector(
          FOCUSABLE
        ) as HTMLElement;
        if (firstInput) firstInput.focus();
      }
    });
  }

  @action maybeCancel(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
      this.cancel();
      ev.preventDefault();
    }
  }

  @action cancel() {
    this.args.onChange?.(this.cachedValue, this.cachedValue);
    scheduleOnce("actions", this, () => {
      this.editing = false;
    });
  }

  @action maybeUpdate(ev: KeyboardEvent) {
    if (ev.key === "Enter") {
      ev.preventDefault();
      let input = this.editorDiv.querySelector(FOCUSABLE) as HTMLElement;
      assert("input value must exist", "value" in input);
      this.update(input.value as string);
    }
  }

  @action
  update(ev: FocusEvent | string[] | PointerEvent | string) {
    scheduleOnce("actions", this, () => {
      this.editing = false;
    });

    if (ev instanceof PointerEvent) {
      // need to get an array of values of the the .person-email div
      let input = this.editorDiv.querySelector(FOCUSABLE) as HTMLElement;
      assert("input value must exist", "value" in input);
      this.args.onChange?.(input.value as string);
      return;
    }
    let newValue: string | string[] = "";
    if (ev instanceof Array || typeof ev === "string") {
      newValue = ev;
    } else {
      assert("event target must exist", ev.target);
      assert("event target must have a value", "value" in ev.target);
      newValue = ev.target.value as string;
    }

    if (newValue !== this.cachedValue) {
      this.args.onChange?.(newValue);
    }
  }
}
