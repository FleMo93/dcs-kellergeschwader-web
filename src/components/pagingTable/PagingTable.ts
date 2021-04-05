import { components, Observable, observable, pureComputed, PureComputed } from "knockout";

export interface Column {
    name: string;
    values: string[];
    sortFunction: (a: string, b: string) => -1 | 1 | 0;
}

class PagingTable {
    private _columns: Observable<Column[]>;
    private _itemsPerPage: number;

    public page = observable(1);

    public pages: PureComputed<number> = pureComputed({
        read: () => {
            if (this._columns().length === 0) {
                return 0;
            }

            return Math.ceil(this._columns()[0].values.length / this._itemsPerPage)
        }
    });

    public columns: PureComputed<Column[]> = pureComputed({
        read: () => {
            return this._columns();
        }
    });

    public values: PureComputed<string[][]> = pureComputed({
        read: () => {
            const values: string[][] = [];
            const startIndex = this._itemsPerPage * (this.page() - 1);
            let endIndex = startIndex + this._itemsPerPage;
            if (endIndex > this._columns()[0].values.length - 1) {
                endIndex = this._columns()[0].values.length - 1;
            }

            
            for (let i = startIndex; i < endIndex; i++) {
                const row: string[] = [];
                this._columns().forEach((c) => {
                    row.push(c.values[i]);
                });

                values.push(row);
            }

            return values;
        }
    })

    constructor(params: {
        columns: Observable<Column[]>,
        itemsPerPage: number
    }) {
        this._columns = params.columns;
        this._itemsPerPage = params.itemsPerPage;
    }

    public nextPage = (): void => {
        if (this.page() == this.pages()) {
            return;
        }

        this.page(this.page() + 1);
    }

    public previousPage = (): void => {
        if (this.page() == 1) {
            return;
        }

        this.page(this.page() - 1);
    }
}

export const registerControl = (name: string): void => {
    if (components.isRegistered(name)) { throw Error(`Component ${name} already registered`); }

    components.register(name, {
        template: require('./PagingTable.html'),
        viewModel: PagingTable
    });
    require('./PagingTable.css');
}