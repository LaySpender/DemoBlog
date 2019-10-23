import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of, from } from 'rxjs';
import { switchMap, map, catchError, filter, mergeMap } from 'rxjs/operators';

import { BlogActions } from '../actions/blog.actions';
import { BlogService } from '../../services/blog.service';
import * as fromRoot from '../../reducers';
import * as fromBlog from '../reducers/blog.selectors';
import { BlogEntry } from '../../entities/BlogEntry';
import { ErrorActions } from 'src/app/core/actions/error.actions';
import { PermissionService } from 'src/app/services/permission.service';

@Injectable()
export class BlogEffects {

    @Effect()
    loadBlogEntries$ = this.actions$.pipe(
        filter(BlogActions.is.LoadBlogEntries),
        switchMap(({ payload: { ids } }) => this.blogService.getEntries(ids)
            .pipe(
                map((blogEntries) => BlogActions.LoadBlogEntriesSuccess({ blogEntries: blogEntries })),
                catchError((error) => from([
                    BlogActions.LoadBlogEntriesFail(error),
                    ErrorActions.ApplicationError({
                        message: `Blogbeiträge konnten nicht geladen werden.`,
                    })]))
            ))
    );

    @Effect()
    loadVotingExperience$ = this.actions$.pipe(
        filter(BlogActions.is.LoadVotingExperience),
        switchMap(() => this.blogService.getVotingExperience()
            .pipe(
                map((votingExperience) => BlogActions.LoadVotingExperienceSuccess(votingExperience)),
                catchError((error) => from([
                    BlogActions.LoadVotingExperienceFail(error),
                    ErrorActions.ApplicationError({
                        message: `Bewertungseinstellungen konnten nicht geladen werden.`,
                    })]))
            ))
    );

    @Effect()
    loadBlogEntry$ = this.actions$.pipe(
        filter(BlogActions.is.LoadBlogEntry),
        map((action) => action.payload),
        mergeMap((payload) => this.store.pipe(
            select(fromBlog.getBlogEntryById, payload.blogEntryId),
            map((blogEntry): [number, BlogEntry] => [payload.blogEntryId, blogEntry])
        )),
        switchMap(([blogEntryId, blogEntry]) => {
            if (blogEntry != null) {
                return of(BlogActions.LoadBlogEntrySuccess({ blogEntry: blogEntry }));
            }
            return this.blogService.getEntry(blogEntryId)
                .pipe(
                    map((loadedBlogEntry) => BlogActions.LoadBlogEntrySuccess({ blogEntry: loadedBlogEntry })),
                    catchError((error) => from([
                        BlogActions.LoadBlogEntryFail(error),
                        ErrorActions.ApplicationError({
                            message: `Blogbeitrag mit der ID '${blogEntryId}' konnte nicht geladen werden.`,
                        })]))
                );
        }));

    @Effect()
    loadBlogToolsPermission$ = this.actions$.pipe(
        filter(BlogActions.is.LoadBlogToolsPermissions),
        switchMap(() => this.permissionService.getPermissions().pipe(
            map((blogToolsPermission) => BlogActions.LoadBlogToolsPermissionsSuccess({ blogToolsPermission: blogToolsPermission })),
            catchError((error) => from([
                BlogActions.LoadBlogToolsPermissionsFail(error),
                ErrorActions.ApplicationError({
                    message: 'Fehler beim Laden der Blogberechtigungen.',
                })]))
        ))
    );

    constructor(private actions$: Actions,
        private blogService: BlogService,
        private permissionService: PermissionService,
        private store: Store<fromRoot.State>) { }
}
