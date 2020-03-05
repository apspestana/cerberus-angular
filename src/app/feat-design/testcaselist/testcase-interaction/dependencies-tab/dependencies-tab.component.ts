import { Component, OnInit, Input } from '@angular/core';
import { TestFolder } from 'src/app/shared/model/back/test.model';
import { TestService } from 'src/app/core/services/api/test/test.service';
import { TestcaseService } from 'src/app/core/services/api/testcase/testcase.service';
import { TestCaseHeader, TestCaseDependency } from 'src/app/shared/model/back/testcase.model';
import { NotificationService } from 'src/app/core/services/utils/notification.service';
import { NotificationStyle } from 'src/app/core/services/utils/notification.model';

@Component({
  selector: 'app-dependencies-tab',
  templateUrl: './dependencies-tab.component.html',
  styleUrls: ['./dependencies-tab.component.scss']
})
export class DependenciesTabComponent implements OnInit {

  /** testcase header object */
  @Input('dependencies') dependencies: TestCaseHeader;

  /** list of available test folders to select */
  public testsList: Array<TestFolder>;

  /** list of test case id corresponding to the selected test folder */
  private testCasesList: Array<TestCaseHeader>;

  /** selected test folder */
  public selectedTestFolderName: string;

  /** selected test case id */
  private selectedTestCase: TestCaseHeader;

  constructor(private testService: TestService, private testCaseService: TestcaseService, private notificationService: NotificationService) { }

  ngOnInit() {
    // refresh the test folder list
    this.testCaseService.getTestFoldersList();

    // subscribe to the test folder list
    this.testCaseService.observableTestsList.subscribe(response => { this.testsList = response; });

    // subscribe to the test case id list
    this.testCaseService.observableTestCasesList4Dependencies.subscribe(response => { this.testCasesList = response; console.log(this.testCasesList); });
  }

  /** fired when selected test folder changes */
  onSelectedTestChange(): void {
    // empty the selected test case
    this.selectedTestCase = null;
    // if the new selected test isn't empty
    if (this.selectedTestFolderName !== null || this.selectedTestFolderName !== undefined) {
      // refresh the test cases id list
      this.testCaseService.getTestCasesList4Dependencies(this.selectedTestFolderName);
    } else {
      // if the new selected test folder is not usable
      this.testCasesList = null;
    }
  }

  /** return true if a test case id is selected */
  isATestCaseSelected(): boolean {
    if (this.selectedTestCase === undefined || this.selectedTestCase === null) {
      return false;
    } else {
      return true;
    }
  }

  /** add a dependency to the test case (if it's not already present) */
  addADependency(): void {
    if (!this.isADependencySelected(this.selectedTestFolderName, this.selectedTestCase.header.testCase)) {
      const newDependency = new TestCaseDependency(this.selectedTestFolderName, this.selectedTestCase.header.testCase);
      this.dependencies.push(newDependency);
    } else {
      this.notificationService.createANotification('This dependency is already selected', NotificationStyle.Error);
    }
  }

  /** return true if there is already a dependency selected for the test case */
  isADependencySelected(test: string, testcase: string): boolean {
    const res = this.dependencies.find(dependency => dependency.test === test && dependency.testCase === testcase);
    if (res === undefined) {
      return false;
    } else {
      return true;
    }
  }

  /** remove the dependency from the test case */
  removeDependency(dependency: TestCaseDependency): void {
    const index = this.dependencies.findIndex(dep => dep.test === dependency.test && dep.testCase === dependency.testCase);
    this.dependencies.splice(index, 1);
  }

}
