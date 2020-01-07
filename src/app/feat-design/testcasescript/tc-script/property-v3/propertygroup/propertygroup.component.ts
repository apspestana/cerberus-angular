import { Component, OnInit, Input } from '@angular/core';
import { ITestCase } from 'src/app/shared/model/testcase.model';
import { TestService } from 'src/app/core/services/crud/test.service';
import { ProperyGroup } from '../property-v3.component';

@Component({
  selector: 'app-propertygroup',
  templateUrl: './propertygroup.component.html',
  styleUrls: ['./propertygroup.component.scss']
})
export class PropertygroupComponent implements OnInit {

  // boolean to handle the display of the property values list
  public propertyValuesDisplayed: boolean;

  // boolean to handle the validation of the property group name
  public propertyNameIsAlreadyUsed: boolean;

  @Input('propertygroup') propertygroup: ProperyGroup; // property grouped by name
  @Input('testcase') testcase: ITestCase; // full testcase object
  @Input('propertyGroups') propertyGroups: Array<ProperyGroup>; // list of all property groups

  constructor(private testService: TestService) { }

  ngOnInit() {
    // hide the property values by default
    this.propertyValuesDisplayed = false;
    // by default, all names are unique
    this.propertyNameIsAlreadyUsed = false;
  }

  // use the format function from test service
  formatCountryList(rawList: any) {
    return this.testService.formatCountryList(rawList);
  }

  // check in all the property values if the country is selected
  // returns true if the country is fetched
  // return false if not
  isACountrySelected(country: string): boolean {
    const countryPresent = (propvalue) => propvalue.country.includes(country);
    return this.propertygroup.values.some(countryPresent);
  }

  // update the boolean to handle the validation of the property group name
  onPropertyNameChange(event: any) {
    // store the values (new and old) as soon as a key is pressed
    const newValue = event.target.value;
    const oldValue = this.propertygroup.property;
    if (this.isAPropertyNameIsAlreadyUsed(newValue, oldValue) === true) {
      // if the property name is already used, its value is set to the old one
      // to avoid conflict
      this.propertygroup.property = oldValue;
      this.propertyNameIsAlreadyUsed = true;
    } else {
      // if the property name is not used, its value is set to the new one
      this.propertygroup.property = newValue;
      this.propertyNameIsAlreadyUsed = false;
    }
  }

  // return true if the property name is already set for another group
  isAPropertyNameIsAlreadyUsed(propnameToCheck: string, propnameBeingModified): boolean {
    // exclude the property group name that it asked from
    const reducedPropertiesList = this.propertyGroups.filter(propertygroup => propertygroup.property !== propnameBeingModified);
    if (propnameToCheck === propnameBeingModified) {
      // we don't compare the property group with itself
      return false;
    } else if (reducedPropertiesList.find(propvalue => propvalue.property === propnameToCheck) === undefined) {
      // if no result is found, returns false
      return false;
    } else {
      // if a property with the same name is found, returns true
      return true;
    }
  }

}
