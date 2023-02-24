import Component from "@glimmer/component";
import { FacetDropdownGroups } from "hermes/types/facets";

interface HeaderComponentSignature {
  Args: {
    facets: FacetDropdownGroups;
    sortControlIsHidden?: boolean;
  };
}

export default class HeaderComponent extends Component<HeaderComponentSignature> {}
