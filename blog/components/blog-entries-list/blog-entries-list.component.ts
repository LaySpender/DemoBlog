import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BlogEntry } from 'src/app/entities/BlogEntry';
import { VotingExperience } from 'src/app/entities/VotingExperience';
import { User } from 'src/app/entities/User';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-blog-entries-list',
    templateUrl: './blog-entries-list.component.html',
    styleUrls: ['./blog-entries-list.component.scss'],
})
export class BlogEntriesListComponent {
    @Input() currentUser: User;
    @Input() blogEntries: BlogEntry[];
    @Input() votingExperience: VotingExperience;

    trackBlogEntry(element: BlogEntry) {
        return element ? element.id : null;
    }
}
