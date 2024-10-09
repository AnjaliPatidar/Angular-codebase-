import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightedText'
})
export class HighlightedTextPipe implements PipeTransform {

  transform(paragraph: string, filterText: any[]): string {
    if (!paragraph || !(filterText.length > 0)) {
      return paragraph;
    }

    let highlightedParagraph = paragraph;

    filterText.forEach(filter => {
      if (filter.name) {
        const { startPosition, endPosition, name, type } = filter;
        const highlighted = `<span class="highlight-text">${paragraph.substring(startPosition, endPosition)}</span><span class="popover-class">${type}</span>`;
        highlightedParagraph = highlightedParagraph.replace(name, highlighted);
      }
    });

    return highlightedParagraph;
  }

}
