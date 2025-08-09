import { NodeViewWrapper } from '@tiptap/react';
import React, { useEffect, useState } from 'react';
import filtre from './livre';
import { Button, ButtonGroup, type ButtonProps } from '../../../../@/components/tiptap-ui-primitive/button';
import { BibleIcon } from '../../../../@/components/tiptap-icons/link-icon';
import { Card, CardBody, CardItemGroup } from '../../../../@/components/tiptap-ui-primitive/card';
import { Input, InputGroup } from '../../../../@/components/tiptap-ui-primitive/input';
import { FluentArrowCircleUp32Filled } from '../../../lib/icons';
import { Separator } from '../../../../@/components/tiptap-ui-primitive/separator';
import type { LinkMainProps } from '../../../../@/components/tiptap-ui/link-popover';
import { useIsMobile } from '../../../../@/hooks/use-mobile';

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

    useEffect(() => {
        const check = /[;:\-v]/g
        const replace = node.attrs.entry.replace(RegExp(check), ' ')
        const spliter = replace.split(RegExp(/\s+/g))


        const verset = filtre({ livre: spliter[0], chap: spliter[1], vers1: spliter[2], vers2: spliter[3] })
        if (verset !== undefined) setContent(verset)

    }, [node.attrs.entry])

    return (
        <NodeViewWrapper className=" h-auto w-full bg-red-50">
            <div className='px-4 pt-3 pb-1'>
                <span className='text-xl font-semibold text-red-800 '>{content?.reference}</span>
            </div>
            <div className='px-4 pb-3'>
                {
                    content?.vers.map((el) => (<span className='text-xl' key={el.n}><span className='inline-block p-1 text-base font-bold'>{el.n}</span>{el.v}</span>))
                }
            </div>
        </NodeViewWrapper>

    )
}

export const biblevertInput = ({
    url,
    setUrl,
    setLink,
    removeLink,
    openLink,
    isActive,
}: LinkMainProps) => {

    const isMobile = useIsMobile()


    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault()
            setLink()
        }
    }

    return (
        <Card
            style={{
                ...(isMobile ? { boxShadow: "none", border: 0 } : {}),
            }}
        >
            <CardBody
                style={{
                    ...(isMobile ? { padding: 0 } : {}),
                }}
            >
                <CardItemGroup orientation="horizontal">
                    <InputGroup>
                        <Input
                            type="text"
                            placeholder="votre verset ici..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                        />
                    </InputGroup>

                    <ButtonGroup orientation="horizontal">
                        <Button
                            type="button"
                            onClick={setLink}
                            title="Apply link"
                            disabled={!url && !isActive}
                            data-style="ghost"
                        >
                            <FluentArrowCircleUp32Filled className="tiptap-button-icon" />
                        </Button>
                    </ButtonGroup>

                    <Separator />

                    {/* <ButtonGroup orientation="horizontal">
                        <Button
                            type="button"
                            onClick={openLink}
                            title="Open in new window"
                            disabled={!url && !isActive}
                            data-style="ghost"
                        >
                            <ExternalLinkIcon className="tiptap-button-icon" />
                        </Button>

                        <Button
                            type="button"
                            onClick={removeLink}
                            title="Remove link"
                            disabled={!url && !isActive}
                            data-style="ghost"
                        >
                            <TrashIcon className="tiptap-button-icon" />
                        </Button>
                    </ButtonGroup> */}
                </CardItemGroup>
            </CardBody>
        </Card>
    )
}


export const BibleButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <Button
                type="button"
                className={className}
                data-style="ghost"
                role="button"
                tabIndex={-1}
                aria-label="Verset Biblique"
                tooltip="Verset Biblique"
                ref={ref}
                {...props}
            >
                {children || <BibleIcon className="tiptap-button-icon" />}
                <span className="sr-only">verset Biblique</span>
            </Button>
        )
    }
)