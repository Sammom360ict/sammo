import { TDB } from '../../features/common/commonUtils/types/commonTypes';
import { IArticleFilterQuery, ICreateArticlePayload, ISingleArticleParams, IUpdateArticlePayload } from '../../utils/interfaces/article/articleInterface';
import Schema from '../../utils/miscellaneous/schema';

class ArticleModel extends Schema {
    private db: TDB;

    constructor(db: TDB) {
        super();
        this.db = db;
    }

    //create article
    public async createArticle(payload: ICreateArticlePayload) {
        return await this.db('article')
            .withSchema(this.DBO_SCHEMA)
            .insert(payload, 'id');
    }

    //list of articles
    public async getArticleList(params: IArticleFilterQuery) {
        console.log(params);
        const data = await this.db('article')
            .withSchema(this.DBO_SCHEMA)
            .select('id', 'title', 'slug', 'thumbnail', 'thumbnail_details', 'status', 'create_date')
            .where((qb) => {
                if (params.status !== undefined) {
                    qb.where('status', params.status);
                }
                if (params.title !== undefined) {
                    qb.andWhere((subQb) => {
                        subQb.where('title', 'ilike', `%${params.title}%`);
                        subQb.orWhere('slug', 'ilike', `%${params.title}%`);
                    });
                }
            })
            .andWhere('deleted', false)
            .orderBy('create_date', 'desc')
            .limit(params.limit ? params.limit : 100)
            .offset(params.skip ? params.skip : 0)

        const total = await this.db('article')
            .withSchema(this.DBO_SCHEMA)
            .count('id as total')
            .where((qb) => {
                if (params.status !== undefined) {
                    qb.where('status', params.status);
                }
                if (params.title !== undefined) {
                    qb.andWhere((subQb) => {
                        subQb.where('title', 'ilike', `%${params.title}%`);
                        subQb.orWhere('slug', 'ilike', `%${params.title}%`);
                    });
                }
            })
            .andWhere('deleted', false);

        return {
            data: data,
            total: total[0].total
        }
    }

    //get single article
    public async getSingleArticle(params: ISingleArticleParams, status: boolean = true, article_id?: number) {
        return await this.db('article')
            .withSchema(this.DBO_SCHEMA)
            .select('id', 'title', 'slug', 'content', 'thumbnail', 'thumbnail_details', 'status', 'create_date')
            .where((qb) => {
                if (params.id) {
                    qb.andWhere('id', params.id)
                }
                if (params.slug) {
                    qb.andWhere('slug', params.slug)
                }
                if (status) {
                    qb.andWhere('status', status)
                }
                if (article_id) {
                    qb.andWhereNot('id', article_id)
                }
            })
            .andWhere('deleted', false)
            .orderBy('create_date', 'desc')
    }

    //update article
    public async updateArticle(payload: IUpdateArticlePayload, id: number) {
        return await this.db('article')
            .withSchema(this.DBO_SCHEMA)
            .update(payload)
            .where({ id })
    }

}
export default ArticleModel;
