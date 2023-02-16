import Component from "@glimmer/component";
import { action } from "@ember/object";
import { FacetDropdownObjects } from "hermes/types/facets";
import { tracked } from "@glimmer/tracking";
import { assert } from "@ember/debug";

interface FacetDropdownComponentSignature {
  Args: {
    label: string;
    facets: FacetDropdownObjects;
    disabled?: boolean;
  };
}

export default class FacetDropdownComponent extends Component<FacetDropdownComponentSignature> {
  @tracked private _triggerElement: HTMLButtonElement | null = null;

  @tracked protected dropdownIsShown = false;

  /**
   * The dropdown trigger.
   * Passed to the dismissible modifier as a dropdown relative.
   */
  protected get triggerElement(): HTMLButtonElement {
    assert("_triggerElement must exist", this._triggerElement);
    return this._triggerElement;
  }

  /**
   * Registers the trigger element.
   * Used to pass the trigger to the dismissible modifier as a relative.
   */
  @action protected registerTrigger(element: HTMLButtonElement) {
    this._triggerElement = element;
  }

  /**
   * Toggles the dropdown visibility.
   * Called when the user clicks on the dropdown trigger.
   */
  @action protected toggleDropdown(): void {
    if (this.dropdownIsShown) {
      // Hide the dropdown and reset the component parameters.
      this.hideDropdown();
    } else {
      this.dropdownIsShown = true;
    }
  }

  /**
   * The action run when the user clicks outside the dropdown.
   * Closes the dropdown and resets the component parameters.
   */
  @action protected hideDropdown(): void {
    this.dropdownIsShown = false;
  }
}
