import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post';
import { Rating } from '../models/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private ratings: Rating[] = [];

  url = environment.baseUrl + 'api/rating';
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: {
      'Content-type' : 'application/json'
    }
  };

  public ratingByPostId(id: number){
    return this.http.get<Rating[]>(this.url + '/post/' + id, this.httpOptions).pipe(
      catchError((err: any) => {
        console.log('PostService.postByUsername() err retrieving post list');
        return throwError(err);
      })
    )
  }
  public update(postId: number,rating: Rating){
    return this.http.put<Rating>(this.url + '/post/' + postId, rating,  this.httpOptions).pipe(
      catchError((err: any) => {
        console.error(err);
        return throwError(
          'error updating rating' + err
        )
      }


    )
    )
  }

  public create(rating: Rating){
    return this.http.post<Rating>(this.url, rating,  this.httpOptions).pipe(
      catchError((err: any) => {
        console.error(err);
        return throwError(
          'error creating rating' + err
        )
      }
    )
    )
  }

}