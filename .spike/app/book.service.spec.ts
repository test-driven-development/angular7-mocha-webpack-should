import {AppService} from './app.service';
import {HttpClientModule} from '@angular/common/http';
import {getTestBed, TestBed} from '@angular/core/testing';

import * as should from 'should';
import * as sinon from 'sinon';

describe(`Book Service`, () => {
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
      imports: [HttpClientModule],
      providers: [AppService],
    }).compileComponents();
  });

  afterEach(() => {
    server.restore();
    getTestBed().resetTestingModule();
  });

  it('should return a list of Book', () => {
    const bookService: AppService = getTestBed().get(AppService);
    return bookService.getBookList().subscribe((books) => {
      books.length.should.equal(3);

      const authors: string[] = books.map((book) => book.author);
      authors.should.deepEqual(['Suzanne Collins', 'Jane Austen', 'C.S. Lewis']);
    });
  });
});
