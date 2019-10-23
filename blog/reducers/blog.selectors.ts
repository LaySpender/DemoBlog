import { createFeatureSelector, createSelector } from '@ngrx/store';

import { BlogEntry } from 'src/app/entities/BlogEntry';
import { State as BlogState } from './blog.reducer';

export const getBlogState = createFeatureSelector<BlogState>('blog');

export const getBlogEntries = createSelector(
    getBlogState,
    (state) => state.blogEntries
);

export const getBlogEntryById = createSelector(
    getBlogEntries,
    (blogEntries: BlogEntry[], id: number) => blogEntries.find((blogEntry) => blogEntry.id === id)
);

export const getBlogEntriesLoadingState = createSelector(
    getBlogState,
    (state) => state.blogEntriesLoadingState
);

export const getVotingExperience = createSelector(
    getBlogState,
    (state) => state.votingExperience
);

export const getVotingExperienceLoadingState = createSelector(
    getBlogState,
    (state) => state.votingExperienceLoadingState
);

export const getBlogEntry = createSelector(
    getBlogState,
    (state) => state.blogEntry
);

export const getBlogEntryLoadingState = createSelector(
    getBlogState,
    (state) => state.blogEntryLoadingState
);

export const getBlogEntryComments = createSelector(
    getBlogState,
    (state) => state.comments
);

export const getBlogEntryCommentsLoadingState = createSelector(
    getBlogState,
    (state) => state.commentsLoadingState
);

export const getBlogToolsPermission = createSelector(
    getBlogState,
    (state) => state.blogToolsPermission
);

export const getBlogToolsPermissionLoadingState = createSelector(
    getBlogState,
    (state) => state.blogToolsPermissionLoadingState
);
