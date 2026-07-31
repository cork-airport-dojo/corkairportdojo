import { Bold, Code2, Heading1, Heading2, Italic, List, ListOrdered, Quote, UnderlineIcon } from "lucide-react";
import styles from './RichTextEditor.module.scss'
import { Button } from "~/components/ui/button";

export default function RichTextToolbar(props: any) {

    const tools = [
        {
            icon: Heading1,
            action: () => props.editor.chain().focus().toggleHeading({ level: 1 }).run()
        },
        {
            icon: Heading2,
            action: () => props.editor.chain().focus().toggleHeading({ level: 2 }).run()
        },
        {
            icon: Bold,
            action: () => props.editor.chain().focus().toggleBold().run()
        },
        {
            icon: Italic,
            action: () => props.editor.chain().focus().toggleItalic().run()
        },
        {
            icon: UnderlineIcon,
            action: () => props.editor.chain().focus().toggleUnderline().run()
        },
        //   {
        //     icon: Link2,
        //     action: setLink
        //   },
        //   {
        //     icon: ImagePlus,
        //     action: addImage
        //   },
        {
            icon: Code2,
            action: () => props.editor.chain().focus().toggleCodeBlock().run()
        },
        {
            icon: Quote,
            action: () => props.editor.chain().focus().toggleBlockquote().run()
        },
        {
            icon: List,
            action: () => props.editor.chain().focus().toggleBulletList().run()
        },
        {
            icon: ListOrdered,
            action: () => props.editor.chain().focus().toggleOrderedList().run()
        }
    ];

    return (
        <ul className={styles.toolbar}>
            {tools.map(({icon: Icon, action}) => (
                <Button
                    type="button"
                    variant="outline"
                    className={styles.toolButton}
                    onClick={action}
                >{<Icon size={16} />}</Button>
            ))}
        </ul>
    )
}