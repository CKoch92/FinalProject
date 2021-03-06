import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Comment } from 'src/app/models/comment';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { RatingService } from 'src/app/services/rating.service';
import { Rating } from 'src/app/models/rating';
import { Song } from 'src/app/models/song';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Playlist } from 'src/app/models/playlist';
import { PostComment } from 'src/app/models/post-comment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  ratings: Rating[] = [];
  newPost = new Post();
  post: Post | null = null;
  followedUser: User | null = null;
  likedPost: Post | null = null;
  loggedInUser = new User;
  comments: Comment[] = [];
  postComments: Comment[] = [];
  public encoded = this.authService.getCredentials();
  public decoded = atob((this.encoded ?? 'null'));
  closeResult = '';
  panelOpenState = false;
  ratingTotal: number = 0;
  ratingPositive: number = 0;
  ratingNegative: number = 0;
  rating: Rating = new Rating();
  newComment: Comment = new Comment();
  enabledPosts: Post[] = [];
  playlists: Playlist[] = [];
  commentVisibility: boolean = false;

  @Input() searchKeyword: string = '';
  @Input() searchResult: Post[] | null | undefined;

  constructor(private userService: UserService,
    private postService: PostService,
    private authService: AuthService,
    private modalService: NgbModal,
    private commentService: CommentService,
    private ratingService: RatingService,
    private playlistService: PlaylistService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnChanges() {
    console.log(this.searchResult);
    if (this.searchResult?.length === 0) {
      let snackbar = this._snackBar.open('No results found.', '', {
        horizontalPosition: 'start',
        verticalPosition: 'top',
        duration: 5 * 1000,
      });
      snackbar.onAction().subscribe(() => {
        console.log('The snack-bar action was triggered!');
      });
    }
    // if(this.searchKeyword === ''){

    // }
 }

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    this.getLoggedInUser();
    this.loadPosts();
    this.getAllComments();
    this.getUserPlaylist();
  }
  getLoggedInUser() {
    this.userService.getCurrentUser(this.decoded.split(':')).subscribe(
      user => {
        this.loggedInUser = user;
        console.log(this.loggedInUser);
      },
      err => {
        console.log('Could not get logged in User');
        let snackbar = this._snackBar.open('You are not logged in.', '', {
          horizontalPosition: 'start',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
        snackbar.onAction().subscribe(() => {
          console.log('The snack-bar action was triggered!');
        });
      }
    );
  }

  viewComments() {
this.commentVisibility = true;
  }

  hideComments() {
this.commentVisibility = false;
  }

  open(content: any) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.hideComments();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  loadPosts() {
    this.enabledPosts = [];
    this.ratingNegative = 0;
    this.ratingPositive = 0;
    this.postService.index().subscribe(
      posts => {
        this.posts = posts;
        this.getEnabledPosts();
        this.enabledPosts.forEach(post => {
          this.ratingNegative = 0;
          this.ratingPositive = 0;
          this.post = post;
          console.log("foreachloop successfully entered");
          this.ratingService.ratingByPostId(post.id).subscribe(
            data => {
              if (this.post) {
                this.post.ratings = data;
                this.ratingNegative = 0;
                this.ratingPositive = 0;
                if (this.post != null) {
                  if (this.post.ratings) {
                    this.post.ratings.forEach(rating => {
                      if (rating.rating == true) {
                        this.ratingPositive++;
                      }
                      if (rating.rating == false) {
                        this.ratingNegative++
                      }
                      post.ratingTotal = this.ratingPositive - this.ratingNegative;
                    });
                  }
                }
              }
            },
            err => {
              console.log(err);
            }
          );
        });
      },
      noPosts => {
        console.error('PostListComponenet.loadPosts: error retrieving posts list')
      }
    )
  }

  like(post: Post) {
    if (this.loggedInUser && this.rating) {
      this.rating.rating = true;
      this.rating.user = this.loggedInUser;
      this.rating.post = post;
      console.log(this.rating.rating);
      console.log(this.rating.user);
      console.log(this.rating.post);

      this.ratingService.create(this.rating).subscribe(
        update => {
          console.log('good rating created')
          this.loadPosts();
          let snackbar = this._snackBar.open('You upvoted "' + post.title + '".', 'UNDO', {
            horizontalPosition: 'start',
            verticalPosition: 'top',
            duration: 5 * 1000,
            panelClass: 'snackbar'

          });
          snackbar.onAction().subscribe(() => {
            this.dislike(post);
          });
        },
        err => {
          console.log(err);
          let snackbar = this._snackBar.open('Could not upvote, please try again.', '', {
            horizontalPosition: 'start',
            verticalPosition: 'top',
            duration: 5 * 1000,
          });
        }
      );
    }
  }

  dislike(post: Post) {
    if (this.loggedInUser && this.rating) {
      this.rating.rating = false;
      this.rating.user = this.loggedInUser;
      this.rating.post = post;
      console.log(this.rating.rating);
      console.log(this.rating.user);
      console.log(this.rating.post);
      this.ratingService.create(this.rating).subscribe(
        update => {
          console.log('bad rating created')
          this.loadPosts();
          let snackbar = this._snackBar.open('You downvoted "' + post.title + '".', 'UNDO', {
            horizontalPosition: 'start',
            verticalPosition: 'top',
            panelClass: 'snackbar',
            duration: 5 * 1000,
          });
          snackbar.onAction().subscribe(() => {
            this.like(post);
          });
          console.log('rating created')
        },
        err => {
          console.log(err);
          let snackbar = this._snackBar.open('Could not downvote, please try again.', '', {
            horizontalPosition: 'start',
            verticalPosition: 'top',
            duration: 5 * 1000,
          });
        }
      );
    }
  }

  getEnabledPosts() {
    for (let i = 0; i < this.posts.length; i++) {
      if (this.posts[i].isEnabled) {
        this.enabledPosts.push(this.posts[i]);
      }
    }
    console.log(this.enabledPosts);
  }

  setPost(post: Post) {
    this.post = post;
  }

  follow(followedUser: User) {
    this.userService.getCurrentUser(this.decoded.split(':')).subscribe(
      user => {
        this.loggedInUser = user;
        this.loggedInUser.following.push(followedUser);
        this.userService.update(this.loggedInUser).subscribe(
          update => {
            console.log('Follow successful');
            this.getLoggedInUser();
            let snackbar = this._snackBar.open('You are now following ' + followedUser.username + '.', 'UNDO', {
              horizontalPosition: 'start',
              verticalPosition: 'top',
              panelClass: 'snackbar',
              duration: 5 * 1000,
            });
            snackbar.onAction().subscribe(() => {
              this.unfollow(followedUser);
            });
          },
          err => {
            console.log('Error following user');
            let snackbar = this._snackBar.open('Could not follow the user, please try again.', '', {
              horizontalPosition: 'start',
              verticalPosition: 'top',
              duration: 5 * 1000,
            });
          }
        );
      },
      err => {
        console.log('Could not get logged in User');
        let snackbar = this._snackBar.open('Could not follow the user, please try again.', '', {
          horizontalPosition: 'start',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      }
    );
  }

  following(user: User) {
    if (this.loggedInUser) {
      for (let i = 0; i < this.loggedInUser.following.length; i++) {
        if (this.loggedInUser.following[i].username === user.username) {
          return true;
        }
      }
    } return false;
  }

  unfollow(user: User) {
    if (this.loggedInUser) {
      for (let i = 0; i < this.loggedInUser.following.length; i++) {
        if (this.loggedInUser.following[i].username === user.username) {
          this.loggedInUser.following.splice(i, 1);
        }
      }
      this.userService.update(this.loggedInUser).subscribe(
        update => {
          this.getLoggedInUser();
          console.log('unfollow successful');
          let snackbar = this._snackBar.open('You unfollowed ' + user.username + '.', 'UNDO', {
            horizontalPosition: 'start',
            verticalPosition: 'top',
            panelClass: 'snackbar',
            duration: 5 * 1000,
          });
          snackbar.onAction().subscribe(() => {
            this.follow(user);
          });
        },
        err => {
          console.log(err);
          let snackbar = this._snackBar.open('Could not unfollow the user, please try again.', '', {
            horizontalPosition: 'start',
            verticalPosition: 'top',
            duration: 5 * 1000,
          });
        }
      );
    }
  }

  getAllComments() {
    this.commentService.allComments().subscribe(
      data => {
        this.comments = data;
        console.log(this.comments);

      },
      err => {
        console.log("Error in commentService with getting all comments");
      }
    );
  }

  getCommentsForPost(post: Post) {
    this.postComments = [];
    this.getAllComments();
    for (let i = 0; i < this.comments.length; i++) {
      if (this.comments[i].post.id === post.id && this.comments[i].isEnabled === true) {
        this.postComments.push(this.comments[i]);
      }
    }
    this.viewComments();
    console.log(this.postComments);
  }

  addComment(comment: Comment) {
    console.log(comment);
    comment.user = this.loggedInUser;
    if (this.post) {
      comment.post = this.post;
    }

    this.commentService.create(comment).subscribe(
      data => {
        console.log("Comment creation successful");
        if (this.post) {
          this.getCommentsForPost(this.post);
          console.log("test");
        }
        this.postComments.push(data);
      },
      err => {
        console.log("Error creating new Comment");
        let snackbar = this._snackBar.open('Could not comment, please try again.', '', {
          horizontalPosition: 'start',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      }
    );
    this.postComments = [];
    this.newComment = new Comment();
  }

  getVideoId(song: Song): string {
    const regex = /[^=]*$/g;
    let songString = song.songURL;
    let songId = songString.substr(songString.search(regex));
    return songId;
  }

  getUserPlaylist() {
    this.playlistService.index().subscribe(
      data => {
        this.playlists = data;
        console.log(data);
      },
      err => {
        console.log("Error getting playlists");
      }
    );
  }

  addSong(song: Song) {
    console.log(song);
    console.log(this.playlists)
    this.playlists[0].songs.push(song);
    this.playlistService.update(this.playlists[0]).subscribe(
      data => {
        this.playlists[0] = data;
        console.log("Playlist updated");
        let snackbar = this._snackBar.open('Song added the favorites.', '', {
          horizontalPosition: 'start',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
        snackbar.onAction().subscribe(() => {
          console.log('The snack-bar action was triggered!');
        });
      },
      err => {
        console.log("error updating playlist");
        let snackbar = this._snackBar.open('Could not add song to favorites.', '', {
          horizontalPosition: 'start',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      }
    );
  }

  get sortedArray(): Post[] {
    return this.enabledPosts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  get sortedComments(): PostComment[] {
    return this.postComments.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

}

