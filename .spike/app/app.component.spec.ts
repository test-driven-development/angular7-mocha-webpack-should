import {AppComponent} from './app.component';
import {BookFormComponent} from './book-form.component';
import {AppService} from './app.service';
import {ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

import * as should from 'should';
import * as sinon from 'sinon';

describe(`App Component`, () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let server: any;

  beforeEach(() => {
    server = sinon.fakeServer.create();
    server.autoRespond = true;
    server.respondWith('GET',
      'http://localhost:8080/book/all',
      [202,
        {'Content-Type': 'application/json'},
        '[' +
        '{"originalTitle" :"The Hunger Games", "author" : "Suzanne Collins"},' +
        '{"originalTitle" :"Pride and Prejudice", "author" : "Jane Austen"},' +
        '{"originalTitle" :"The Chronicles of Narnia", "author" : "C.S. Lewis"}' +
        ']'
      ]
    );

    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule],
      declarations: [AppComponent, BookFormComponent],
      providers: [AppService],
    }).compileComponents();
  });

  afterEach(() => {
    server.restore();
    getTestBed().resetTestingModule();
  });

  it('should display a title', () => {
    let title: any;
    fixture = TestBed.createComponent(AppComponent);

    title = fixture.debugElement.query(By.css('h2'));
    title.nativeElement.textContent.should.equal('');

    fixture.detectChanges();

    title = fixture.debugElement.query(By.css('h2'));
    title.nativeElement.textContent.should.equal('Best Of Books');
  });

  it('should have a non empty book List', () => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    true.should.equal(true);
    comp.bookList.length.should.equal(0);

    return fixture.whenStable().then(() => {
      fixture.detectChanges();

      comp.bookList.length.should.equal(3);

      const bookTitle = fixture.debugElement.query(By.css('li span'));
      bookTitle.nativeElement.textContent.should.equal('The Hunger Games');
    });
  });

  it('should display a empty message when empty book list', () => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      comp.bookList = []; // Empty Book List

      fixture.detectChanges();
      const bookTitle = fixture.debugElement.query(By.css('h4'));
      should.not.exist(bookTitle);

      const errorMessage = fixture.debugElement.query(By.css('span'));
      errorMessage.nativeElement.textContent.should.equal('Book List is empty !');
    });
  });
});

