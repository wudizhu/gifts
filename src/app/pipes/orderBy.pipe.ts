import { NumberFormatStyle } from "@angular/common/src/pipes/intl";
import { forEach } from "@angular/router/src/utils/collection";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "orderBy" })
export class OrderByPipe implements PipeTransform {
  transform(gifts: Array<any>, args?: any): any {
    if (!gifts) return gifts;
    return gifts.sort(function(a, b) {
      let ratingA: number = a[args.property];
      let ratingB :number = b[args.property];

        if (ratingA < ratingB) {
          return -1 * args.direction;
        } else if (ratingA > ratingB) {
          return 1 * args.direction;
        }
      
      return 0;
    });
  }
}
