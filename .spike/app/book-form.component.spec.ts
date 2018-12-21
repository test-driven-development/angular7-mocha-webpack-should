import {BookFormComponent} from './book-form.component';
import {ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

import * as should from 'should';
const td = require('testdouble');
const {replace, verify} = td;

function newEvent(eventName: string, bubbles = false, cancelable = false) {
  const evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
  evt.initCustomEvent(eventName, bubbles, cancelable, null);
  return evt;
}

describe(`Book Form Component`, () => {
  let bookFormComponent: BookFormComponent;
  let fixture: ComponentFixture<BookFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [BookFormComponent],
    }).compileComponents();
  });

  afterEach(() => {
    getTestBed().resetTestingModule();
  });

  it('should display a title', () => {
    fixture = TestBed.createComponent(BookFormComponent);
    let title: any;

    title = fixture.debugElement.query(By.css('h1'));
    title.nativeElement.textContent.should.equal('');

    fixture.detectChanges();

    title = fixture.debugElement.query(By.css('h1'));
    title.nativeElement.textContent.should.equal('Add New Book');
  });

  it('should log book title', () => {
    fixture = TestBed.createComponent(BookFormComponent);
    bookFormComponent = fixture.componentInstance;

    const originalTitleInput = fixture.debugElement.query(By.css('#originalTitle')).nativeElement;
    const logSpan = fixture.debugElement.query(By.css('span'));

    fixture.detectChanges();
    logSpan.nativeElement.textContent.should.equal('Log : ');

    return fixture.whenStable().then(() => {
      originalTitleInput.value = 'Harry Potter';
      originalTitleInput.dispatchEvent(newEvent('input'));
      fixture.detectChanges();

      bookFormComponent.model.originalTitle.should.equal('Harry Potter');
      logSpan.nativeElement.textContent.should.equal('Log : Harry Potter');
    });
  });

  it('should call newBook function when submit button clicked', () => {
    fixture = TestBed.createComponent(BookFormComponent);
    bookFormComponent = fixture.componentInstance;

    const submitButton = fixture.debugElement.query(By.css('#submit'));
    replace(bookFormComponent, 'onSubmit');
    replace(bookFormComponent, 'newBook');

    submitButton.triggerEventHandler('click', {});

    verify(bookFormComponent.onSubmit(), {times: 0});
    verify(bookFormComponent.newBook(), {times: 1});
  });

  it('should call onSubmit function when form submitted', () => {
    fixture = TestBed.createComponent(BookFormComponent);
    bookFormComponent = fixture.componentInstance;

    const form = fixture.debugElement.query(By.css('form'));
    replace( bookFormComponent, 'onSubmit');
    replace(bookFormComponent, 'newBook');

    form.triggerEventHandler('submit', {});

    verify(bookFormComponent.onSubmit(), {times: 1});
    verify(bookFormComponent.newBook(), {times: 0});
  });
});
