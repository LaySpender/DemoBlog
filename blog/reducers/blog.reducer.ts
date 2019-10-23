import produce from 'immer';

import {
    BlogActions,
    BlogActionTypes,
} from '../actions/blog.actions';
import { BlogEntry } from 'src/app/entities/BlogEntry';
import { LoadingState } from 'src/app/entities/LoadingState';
import { VotingExperience } from 'src/app/entities/VotingExperience';
import { BlogEntryComment } from 'src/app/entities/BlogEntryComment';
import { BlogToolsPermission } from 'src/app/entities/BlogToolsPermission';

export interface State {
    blogEntries: BlogEntry[];
    blogEntriesLoadingState: LoadingState;
    votingExperience: VotingExperience;
    votingExperienceLoadingState: LoadingState;
    blogEntry: BlogEntry;
    blogEntryLoadingState: LoadingState;
    comments: BlogEntryComment[];
    commentsLoadingState: LoadingState;
    blogToolsPermission: BlogToolsPermission;
    blogToolsPermissionLoadingState: LoadingState;
}

export const initialState: State = {
    blogEntries: [],
    blogEntriesLoadingState: LoadingState.Indeterminate,
    votingExperience: VotingExperience.Disabled,
    votingExperienceLoadingState: LoadingState.Indeterminate,
    blogEntry: null,
    blogEntryLoadingState: LoadingState.Indeterminate,
    comments: [],
    commentsLoadingState: LoadingState.Indeterminate,
    blogToolsPermission: null,
    blogToolsPermissionLoadingState: LoadingState.Indeterminate,
};

export function reducer(state = initialState, action: BlogActionTypes) {
    return produce<State>(state, (draft) => {
        BlogActions.match(action, {
            LoadBlogEntries: () => { draft.blogEntriesLoadingState = LoadingState.Loading; },
            LoadBlogEntriesSuccess: ({ blogEntries }) => {
                draft.blogEntries = blogEntries;
                draft.blogEntriesLoadingState = LoadingState.Loaded;
            },
            LoadBlogEntriesFail: () => { draft.blogEntriesLoadingState = LoadingState.Failed; },
            LoadBlogEntry: () => {
                draft.blogEntryLoadingState = LoadingState.Loading;
            },
            LoadBlogEntrySuccess: ({ blogEntry }) => {
                draft.blogEntryLoadingState = LoadingState.Loaded;
                draft.blogEntry = blogEntry;
            },
            LoadBlogEntryFail: () => {
                draft.blogEntryLoadingState = LoadingState.Failed;
            },
            LoadVotingExperience: () => { draft.votingExperienceLoadingState = LoadingState.Loading; },
            LoadVotingExperienceSuccess: (votingExperience) => {
                draft.votingExperience = votingExperience;
                draft.votingExperienceLoadingState = LoadingState.Loaded;
            },
            LoadVotingExperienceFail: () => {
                draft.votingExperience = VotingExperience.Disabled;
                draft.votingExperienceLoadingState = LoadingState.Failed;
            },
            LikeBlogEntrySuccess: ({ blogEntry, user }) => {
                draft.blogEntries = draft.blogEntries.map((b) => {
                    if (b.id !== blogEntry.id) {
                        return b;
                    }

                    // if the user already liked the entry don't like it again
                    if (b.likedByUserIds.includes(user.id)) {
                        return b;
                    }

                    b.likesCount += 1;
                    b.likedByUserIds.push(user.id);
                    b.likedBy.push({
                        id: user.id,
                        fullName: user.fullName,
                        mail: user.mail,
                    });

                    return b;
                });

                if (draft.blogEntry == null || draft.blogEntry.id !== blogEntry.id || blogEntry.likedByUserIds.includes(user.id)) {
                    return;
                }

                draft.blogEntry.likesCount += 1;
                draft.blogEntry.likedByUserIds.push(user.id);
                draft.blogEntry.likedBy.push({
                    id: user.id,
                    fullName: user.fullName,
                    mail: user.mail,
                });
            },
            UnlikeBlogEntrySuccess: ({ blogEntry, user }) => {
                draft.blogEntries = draft.blogEntries.map((b) => {
                    if (b.id !== blogEntry.id) {
                        return b;
                    }

                    if (!b.likedByUserIds.includes(user.id)) {
                        return b;
                    }

                    if (b.likesCount > 0) {
                        b.likesCount -= 1;
                    }
                    b.likedByUserIds = b.likedByUserIds.filter((id) => id !== user.id);
                    b.likedBy = b.likedBy.filter((u) => user.id !== u.id);

                    return b;
                });

                if (draft.blogEntry == null || draft.blogEntry.id !== blogEntry.id || !blogEntry.likedByUserIds.includes(user.id)) {
                    return;
                }

                if (draft.blogEntry.likesCount > 0) {
                    draft.blogEntry.likesCount -= 1;
                }
                draft.blogEntry.likedByUserIds = draft.blogEntry.likedByUserIds.filter((id) => id !== user.id);
                draft.blogEntry.likedBy = draft.blogEntry.likedBy.filter((u) => user.id !== u.id);
            },
            RateBlogEntrySuccess: ({ blogEntry, user, rating }) => {
                draft.blogEntries = draft.blogEntries.map((b) => {
                    if (b.id !== blogEntry.id) {
                        return b;
                    }

                    if (b.ratings[user.id] == null) {
                        b.ratingCount += 1;
                        b.ratedBy.push({
                            id: user.id,
                            fullName: user.fullName,
                            mail: user.mail,
                        });
                    }

                    b.ratings[user.id] = rating;
                    b.averageRating = Object.keys(b.ratings)
                        .map((key) => b.ratings[key])
                        .reduce((prev, cur) => prev + cur, 0) / Object.keys(b.ratings).length;


                    return b;
                });

                if (draft.blogEntry == null || draft.blogEntry.id !== blogEntry.id) {
                    return;
                }

                if (draft.blogEntry.ratings[user.id] == null) {
                    draft.blogEntry.ratingCount += 1;
                    draft.blogEntry.ratedBy.push({
                        id: user.id,
                        fullName: user.fullName,
                        mail: user.mail,
                    });
                }

                draft.blogEntry.ratings[user.id] = rating;
                draft.blogEntry.averageRating = Object.keys(draft.blogEntry.ratings)
                    .map((key) => draft.blogEntry.ratings[key])
                    .reduce((prev, cur) => prev + cur, 0) / Object.keys(draft.blogEntry.ratings).length;
            },

            LoadComments: () => {
                draft.commentsLoadingState = LoadingState.Loading;
            },
            LoadCommentsSuccess: ({ blogEntryComments }) => {
                draft.commentsLoadingState = LoadingState.Loaded;
                draft.comments = blogEntryComments;
            },
            LoadCommentsFail: () => {
                draft.commentsLoadingState = LoadingState.Failed;
            },
            AddCommentToBlogEntrySuccess: ({ blogEntryComment: comment }) => {
                if (draft.blogEntry == null || draft.blogEntry.id !== comment.blogEntryId) {
                    return;
                }
                const blogEntry = draft.blogEntries.find((b) => b.id === comment.blogEntryId);
                if (blogEntry != null) {
                    blogEntry.numberOfComments += 1;
                }
                draft.blogEntry.numberOfComments += 1;
                draft.comments.push(comment);
            },
            LoadBlogToolsPermissions: () => { draft.blogToolsPermissionLoadingState = LoadingState.Loading; },
            LoadBlogToolsPermissionsSuccess: ({ blogToolsPermission }) => {
                draft.blogToolsPermission = blogToolsPermission;
                draft.blogToolsPermissionLoadingState = LoadingState.Loaded;
            },
            LoadBlogToolsPermissionsFail: () => { draft.blogToolsPermissionLoadingState = LoadingState.Failed; },
            default: () => { },
        });
    }) as State;
}
