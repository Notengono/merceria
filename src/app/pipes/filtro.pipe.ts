import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(value: any[], args: any): any {
    const resultadoPost = [];
    const searchText = args;

    if (!searchText) {
      return value;
    } else {
      for (let post of value) {
        if (
          post.producto &&
          post.producto
            .toLowerCase()
            .includes(searchText.toLowerCase())
        ) {
          resultadoPost.push(post);
        }
      }
      return resultadoPost;
    }
  }
}
