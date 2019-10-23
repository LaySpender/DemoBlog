import { unionize, ofType } from 'unionize';

import { BlogEntry } from '../../entities/BlogEntry';
import { VotingExperience } from '../../entities/VotingExperience';
import { User } from '../../entities/User';
import { BlogEntryComment } from '../../entities/BlogEntryComment';
import { BlogToolsPermission } from 'src/app/entities/BlogToolsPermission';

export const BlogActions = unionize({
    LoadBlogEntries: ofType<{ ids: number[] }>(),
    LoadBlogEntriesSuccess: ofType<{ blogEntries: BlogEntry[] }>(),
    LoadBlogEntriesFail: ofType<any>(),

    LoadBlogEntry: ofType<{ blogEntryId: number }>(),
    LoadBlogEntrySuccess: ofType<{ blogEntry: BlogEntry }>(),
    LoadBlogEntryFail: ofType<any>(),

    LoadComments: ofType<{ blogEntryId: number }>(),
    LoadCommentsSuccess: ofType<{ blogEntryComments: BlogEntryComment[] }>(),
    LoadCommentsFail: ofType<any>(),

    LoadVotingExperience: {},
    LoadVotingExperienceSuccess: ofType<VotingExperience>(),
    LoadVotingExperienceFail: ofType<any>(),

    LikeBlogEntry: ofType<{ blogEntry: BlogEntry, user: User }>(),
    LikeBlogEntrySuccess: ofType<{ blogEntry: BlogEntry, user: User }>(),
    LikeBlogEntryFail: ofType<any>(),

    UnlikeBlogEntry: ofType<{ blogEntry: BlogEntry, user: User }>(),
    UnlikeBlogEntrySuccess: ofType<{ blogEntry: BlogEntry, user: User }>(),
    UnlikeBlogEntryFail: ofType<any>(),

    RateBlogEntry: ofType<{ blogEntry: BlogEntry, user: User, rating: number }>(),
    RateBlogEntrySuccess: ofType<{ blogEntry: BlogEntry, user: User, rating: number }>(),
    RateBlogEntryFail: ofType<any>(),

    AddCommentToBlogEntry: ofType<{ blogEntry: BlogEntry, user: User, commentText: string }>(),
    AddCommentToBlogEntrySuccess: ofType<{ blogEntryComment: BlogEntryComment }>(),
    AddCommentToBlogEntryFail: ofType<any>(),

    LoadBlogToolsPermissions: {},
    LoadBlogToolsPermissionsSuccess: ofType<{ blogToolsPermission: BlogToolsPermission }>(),
    LoadBlogToolsPermissionsFail: ofType<any>(),
}, {
        tag: 'type',
        value: 'payload',
    });

export type BlogActionTypes = typeof BlogActions._Union;
