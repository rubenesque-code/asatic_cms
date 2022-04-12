import { ImageType } from '^types/common'
import { Document, Translation } from '^types/editableContent'

type Section = {
  id: string
  order: number
}

export type TextSection = Section & {
  type: 'text'
  htmlString: string
}

export type ImageSection = Section & {
  type: 'image'
  imageContent: {
    url: string
    caption: string
    type: ImageType
  }
}

export type TranslationSection = TextSection | ImageSection

export type TranslationTextField = 'summary' | 'author' | 'title'

export type ArticleTranslation = Translation & {
  author: string
  sections: TranslationSection[]
  summary: string
}

export type Article = Document<ArticleTranslation> & {
  optionalComponents: {
    useAuthor: boolean
  }
  summaryImage: {
    url: string
  }
}
