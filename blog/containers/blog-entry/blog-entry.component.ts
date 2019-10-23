import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { faTag } from '@fortawesome/free-solid-svg-icons/faTag';

import { State as BlogState } from '../../reducers/blog.reducer';
import { BlogEntry } from 'src/app/entities/BlogEntry';
import { VotingExperience } from 'src/app/entities/VotingExperience';
import { User } from 'src/app/entities/User';
import { Store } from '@ngrx/store';
import { BlogActions } from '../../actions/blog.actions';
import buildResolveUrl from 'src/app/util/buildResolveUrl';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-blog-entry',
    templateUrl: './blog-entry.component.html',
    styleUrls: ['./blog-entry.component.scss'],
})
export class BlogEntryComponent {
    @Input() currentUser: User;
    @Input() blogEntry: BlogEntry;
    @Input() votingExperience: VotingExperience;
    @Input() isPreview: boolean;
    @Output() writeComment: EventEmitter<any> = new EventEmitter();

    votingExperienceType = VotingExperience;

    faTag = faTag;

    constructor(private store: Store<BlogState>) { }

    handleLike() {
        if (this.votingExperience === VotingExperience.Likes) {
            this.store.dispatch(BlogActions.LikeBlogEntry({ blogEntry: this.blogEntry, user: this.currentUser }));
        }
    }

    handleDislike() {
        if (this.votingExperience === VotingExperience.Likes) {
            this.store.dispatch(BlogActions.UnlikeBlogEntry({ blogEntry: this.blogEntry, user: this.currentUser }));
        }
    }

    handleRate(rating: number) {
        if (this.votingExperience === VotingExperience.Ratings) {
            this.store.dispatch(BlogActions.RateBlogEntry({ blogEntry: this.blogEntry, user: this.currentUser, rating: rating }));
        }
    }

    handleWriteCommentClick() {
        this.writeComment.emit(null);
    }

    get id() {
        return this.blogEntry.id;
    }

    get author() {
        return this.blogEntry.author;
    }

    get publishedDate() {
        return this.blogEntry.publishedDate;
    }

    get title() {
        return this.blogEntry.title;
    }

    get text() {
        return this.blogEntry.body;
    }

    get teaserText() {
        return this.blogEntry.teaserBody;
    }

    get categories() {
        return this.blogEntry.categories;
    }

    get tags() {
        return this.blogEntry.tags;
    }

    get numberOfComments() {
        return this.blogEntry.numberOfComments;
    }

    get averageRating() {
        return this.blogEntry.averageRating;
    }

    get ratingCount() {
        return this.blogEntry.ratingCount;
    }

    get likesCount() {
        return this.blogEntry.likesCount;
    }

    get isLikedByUser() {
        return this.blogEntry.likedByUserIds.includes(this.currentUser.id);
    }

    get likers() {
        return this.blogEntry.likedBy;
    }

    get editLink() {
        const layoutsUrl = `${_spPageContextInfo.webAbsoluteUrl}/${_spPageContextInfo.layoutsUrl}`;
        const listId = encodeURIComponent(this.blogEntry.listId);
        const id = encodeURIComponent(this.id.toString());
        const sourceUrl = encodeURIComponent(buildResolveUrl());
        const page = `listform.aspx?PageType=6&ListId=${listId}&ID=${id}&Source=${sourceUrl}`;

        return `${layoutsUrl}/${page}`;
    }

    get publisher() {
        return this.blogEntry.publisher.id ? this.blogEntry.publisher : this.blogEntry.author;
    }

    get linkPerMail() {
        // Quick and dirty way to build the blog entry permalink
        const url = encodeURIComponent(
            `${window.location.protocol}//${window.location.hostname}${window.location.pathname}#/blog/${this.id}`
        );
        // Use resource string 
        const subject = encodeURIComponent(`"${this.title}" von ${this.publisher.fullName}`);

        return `mailto:?Subject=${subject}&body=${url}`;
    }
}
