import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { map, takeUntil, debounceTime } from 'rxjs/operators';

import * as fromBlog from '../../reducers/blog.selectors';
import * as fromCore from 'src/app/core/reducers/current-user.selectors';
import * as fromFilter from '../../reducers/filter.selectors';
import * as fromPagination from '../../reducers/pagination.selectors';
import * as fromRoot from 'src/app/reducers';
import * as fromRouter from 'src/app/reducers/router.selectors';
import { BlogActions } from '../../actions/blog.actions';
import { BlogEntry } from 'src/app/entities/BlogEntry';
import { CategoryGroup } from 'src/app/entities/CategoryGroup';
import { LoadingState } from 'src/app/entities/LoadingState';
import { PaginationActions } from '../../actions/pagination.actions';
import { User } from 'src/app/entities/User';
import { VotingExperience } from 'src/app/entities/VotingExperience';

@Component({
    selector: 'app-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent implements OnInit, OnDestroy {
    currentUser$: Observable<User>;
    blogEntries$: Observable<BlogEntry[]>;
    contentLoadingState$: Observable<LoadingState>;
    votingExperience$: Observable<VotingExperience>;
    categories$: Observable<CategoryGroup[]>;
    pageSize$: Observable<number>;
    totalNumberOfItems$: Observable<number>;
    currentPage$: Observable<number>;

    loadingState = LoadingState;

    private unsubscribe: Subject<void> = new Subject();

    constructor(private store: Store<fromRoot.State>) {
        this.currentUser$ = this.store.pipe(
            select(fromCore.getCurrentUser)
        );

        this.contentLoadingState$ = combineLatest(
            this.store.pipe(select(fromBlog.getBlogEntriesLoadingState)),
            this.store.pipe(select(fromBlog.getVotingExperienceLoadingState)),
            this.store.pipe(select(fromPagination.getPaginationItemsLoadingState))
        ).pipe(
            debounceTime(100),
            map((loadingStates) => {
                if (loadingStates.every((l) => l === LoadingState.Loaded)) {
                    return LoadingState.Loaded;
                }

                if (loadingStates.find((l) => l === LoadingState.Failed) != null) {
                    return LoadingState.Failed;
                }

                return LoadingState.Loading;
            })
        );

        this.blogEntries$ = this.store.pipe(
            select(fromBlog.getBlogEntries),
            // Sort descending
            map((entries) => entries.slice().sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime()))
        );

        this.votingExperience$ = this.store.pipe(
            select(fromBlog.getVotingExperience)
        );

        this.pageSize$ = this.store.pipe(
            select(fromPagination.getPageSize)
        );

        this.totalNumberOfItems$ = this.store.pipe(
            select(fromPagination.getPaginationItems),
            map((items) => items.length)
        );

        this.currentPage$ = this.store.pipe(select(fromRouter.getCurrentPage));
    }

    ngOnInit() {
        this.store.dispatch(BlogActions.LoadVotingExperience());
        combineLatest(
            this.store.pipe(select(fromFilter.getSelectedCategories)),
            this.store.pipe(select(fromFilter.getSelectedTags)),
            this.store.pipe(select(fromFilter.getSelectedDateFilters)),
            this.currentUser$
        ).pipe(
            takeUntil(this.unsubscribe),
            debounceTime(100)
        ).subscribe(([categories, tags, dateFilters, currentUser]) => this.store.dispatch(
            PaginationActions.LoadPagingItems({
                categories: categories,
                tags: tags,
                dateFilters: dateFilters,
                currentUser: currentUser,
            }))
        );
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    changePage(page: number) {
        this.store.dispatch(PaginationActions.ChangePage({ pageNumber: page }));
    }

    get showPagination$(): Observable<boolean> {
        return combineLatest(
            this.totalNumberOfItems$,
            this.pageSize$
        ).pipe(
            map(([totalNumberOfItems, pageSize]) => totalNumberOfItems > pageSize)
        );
    }
}
