import { NodeViewWrapper } from '@tiptap/react';
import { useEffect, useState } from 'react';
import filtre from './livre';
import { FluentArrowUp32Filled } from '../../../lib/icons';


type FilterProps = {
    chapitre: string;
    vers: {
        n: number;
        v: string;
    }[];
    versChar: string;
    reference: string;
}

export default function BibleVerset({ node }: { node: { attrs: { entry: string } } }) {
    const [content, setContent] = useState<FilterProps | null>(null)
    const [verse, setVerse] = useState<string>("")

    useEffect(() => {
        const check = /[;:\-v]/g
        const replace = node.attrs.entry.replace(RegExp(check), ' ')
        const spliter = replace.split(RegExp(/\s+/g))


        const verset = filtre({ livre: spliter[0], chap: spliter[1], vers1: spliter[2], vers2: spliter[3] })
        if (verset !== undefined) setContent(verset)

        console.log('verset', verset)
    }, [node.attrs.entry,])

    const handleVerse = () => {
        console.log('verse', verse)
    }

    return (
        <NodeViewWrapper className=" h-auto w-full bg-red-50">
            {/* <div className='px-4 pt-3 pb-1'>
                <span className='font-semibold text-red-800 '>{content?.reference}</span>
            </div>
            <div className='px-4 pb-3'>
                {
                    content?.vers.map((el) => (<span key={el.n}><span className='inline-block p-1 text-xs font-bold'>{el.n}</span>{el.v}</span>))
                }
            </div> */}
            <div>
                <div>
                    <input type="text" placeholder='Votre verset' onChange={({ target }) => setVerse(target.value as string)} />
                    <button>
                        <FluentArrowUp32Filled className="h-4 w-4 text-red-500" />
                    </button>
                </div>
            </div>
        </NodeViewWrapper>

    )
}

